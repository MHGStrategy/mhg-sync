import { randomUUID } from "node:crypto";
import { Router, type Request } from "express";
import { query } from "@mhg-sync/db";
import { toolExecutor } from "@mhg-sync/llm";
import { eventBus, EVENT_TYPES } from "@mhg-sync/agents";
import {
  enqueueIntegrationJob,
  isWebhookProcessed,
  markWebhookProcessed,
  parseTwentyWebhook,
  verifyHmacSha256,
  verifyPlaneWebhookSignature,
} from "@mhg-sync/integrations";
import { createIntakeSubmission, isDashboardId } from "../services/intake-store.js";
import { syncIntakeToCrm } from "../services/intake-crm-sync.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export const webhooksRouter = Router();

/** Plane/Twenty sign the raw request bytes; JSON.stringify(parsed body) breaks verification. */
function webhookRawBody(req: Request): string {
  if (req.rawBody) return req.rawBody.toString("utf8");
  if (typeof req.body === "string") return req.body;
  return JSON.stringify(req.body);
}

webhooksRouter.get("/api/webhooks/linkedin/leads", (req, res) => {
  const challenge = req.query.challenge;
  if (challenge) {
    res.send(String(challenge));
    return;
  }
  res.status(200).send("ok");
});

webhooksRouter.post("/api/webhooks/intake", async (req, res) => {
  const secret = process.env.INTAKE_WEBHOOK_SECRET;
  if (secret && req.headers["x-intake-secret"] !== secret) {
    res.status(401).json({ error: "Invalid secret" });
    return;
  }

  const body = req.body as {
    clientEmail: string;
    clientName?: string;
    formType?: string;
    dashboardId?: string;
    formData?: Record<string, unknown>;
  };

  const tenantId = process.env.TENANT_ID ?? "mhgstrategy";

  const { contactId } = await syncIntakeToCrm({
    tenantId,
    clientEmail: body.clientEmail,
    clientName: body.clientName ?? "",
    formType: body.formType ?? "unknown",
    dashboardId: body.dashboardId,
    formData: body.formData,
  });

  // Mirror the submission into the local SQLite intake store so the HQ dashboard can display it.
  try {
    const incomingId = body.dashboardId && isDashboardId(body.dashboardId) ? body.dashboardId : undefined;
    createIntakeSubmission({
      formType: body.formType ?? "unknown",
      clientName: body.clientName ?? "",
      clientEmail: body.clientEmail,
      formData: body.formData ?? {},
      dashboardId: incomingId,
    });
  } catch {
    // best-effort — don't block the response
  }

  try {
    const { eventBus, EVENT_TYPES, getOrchestrator } = await import("@mhg-sync/agents");
    await eventBus.publish({
      tenantId,
      source: "system",
      eventType: EVENT_TYPES.LEAD_INBOUND,
      payload: {
        contactId,
        dashboardId: body.dashboardId,
        formType: body.formType,
        leadSource: "intake",
      },
    });

    void getOrchestrator().handleTask({
      id: randomUUID(),
      tenantId,
      agentDomain: "sales",
      taskType: "lead_inbound",
      input: { contactId, ...body },
      triggeredBy: "event_bus",
      priority: "normal",
      createdAt: new Date(),
      traceId: randomUUID(),
    });
  } catch (err) {
    console.warn("[intake webhook] post-CRM agent/event step failed (CRM record saved):", err);
  }

  res.status(202).json({ ok: true, contactId });
});

webhooksRouter.post("/api/webhooks/linkedin/leads", async (req, res) => {
  if (process.env.WEBHOOK_MOCK !== "true" && !req.headers["x-li-signature"]) {
    res.status(401).json({ error: "Invalid signature" });
    return;
  }

  const body = req.body as {
    firstName?: string;
    lastName?: string;
    email?: string;
    company?: string;
    title?: string;
  };

  const contactId = randomUUID();
  const tenantId = process.env.TENANT_ID ?? "mhgstrategy";
  await query(
    `INSERT INTO contacts (id, tenant_id, first_name, last_name, email, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,NOW(),NOW())`,
    [contactId, tenantId, body.firstName ?? "", body.lastName ?? "", body.email ?? ""],
    ["crm"],
  );

  await eventBus.publish({
    tenantId,
    source: "system",
    eventType: EVENT_TYPES.CONTACT_CREATED,
    payload: {
      contactId,
      name: [body.firstName, body.lastName].filter(Boolean).join(" "),
      email: body.email,
    },
    correlationId: randomUUID(),
  });

  void toolExecutor.execute(
    "score_lead",
    { contactId, companyName: body.company, title: body.title, leadSource: "linkedin_paid" },
    {
      tenantId: process.env.TENANT_ID ?? "mhgstrategy",
      agentDomain: "sales",
      userId: "system",
      traceId: randomUUID(),
      taskId: randomUUID(),
    },
  );

  res.status(200).json({ ok: true, contactId });
});

webhooksRouter.get("/api/webhooks/meta/leads", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === process.env.META_LEAD_WEBHOOK_SECRET) {
    res.send(String(challenge));
    return;
  }
  res.status(403).send("Forbidden");
});

webhooksRouter.post("/api/webhooks/meta/leads", async (req, res) => {
  if (process.env.WEBHOOK_MOCK !== "true" && !req.headers["x-hub-signature-256"]) {
    res.status(401).json({ error: "Invalid signature" });
    return;
  }

  const entry = (req.body as { entry?: Array<{ changes?: Array<{ value?: { email?: string; full_name?: string } }> }> })
    .entry?.[0];
  const lead = entry?.changes?.[0]?.value;
  const contactId = randomUUID();
  const tenantId = process.env.TENANT_ID ?? "mhgstrategy";
  await query(
    `INSERT INTO contacts (id, tenant_id, email, first_name, created_at, updated_at)
     VALUES ($1,$2,$3,$4,NOW(),NOW())`,
    [contactId, tenantId, lead?.email ?? "", lead?.full_name ?? ""],
    ["crm"],
  );

  await eventBus.publish({
    tenantId,
    source: "system",
    eventType: EVENT_TYPES.CONTACT_CREATED,
    payload: { contactId, name: lead?.full_name ?? "", email: lead?.email },
    correlationId: randomUUID(),
  });

  res.status(200).json({ ok: true, contactId });
});

webhooksRouter.post("/api/webhooks/twenty", async (req, res) => {
  const rawBody = webhookRawBody(req);
  // Twenty sends x-twenty-webhook-signature (not x-twenty-signature)
  const signature = req.headers["x-twenty-webhook-signature"];
  const timestamp = req.headers["x-twenty-webhook-timestamp"];
  const secret = process.env.TWENTY_WEBHOOK_SECRET;

  if (process.env.WEBHOOK_MOCK !== "true") {
    // Twenty self-hosted runs on the same VPS — trust its Docker internal IP range (172.18.x.x)
    // AND verify HMAC when secret + signature are both present.
    const socketAddr = req.socket.remoteAddress ?? "";
    const realIp = String(req.headers["x-real-ip"] ?? req.headers["x-forwarded-for"] ?? "");
    // All Apache-proxied requests arrive at the API via localhost; Twenty Docker IP via x-real-ip
    const fromTwentyDocker =
      socketAddr === "127.0.0.1" ||
      socketAddr === "::1" ||
      socketAddr === "::ffff:127.0.0.1" ||
      /^172\.\d+\.\d+\.\d+$/.test(realIp);

    if (typeof signature === "string" && secret) {
      // Try HMAC verification — if it passes, accept; if it fails, fall through to IP check
      const signedPayload = typeof timestamp === "string" ? `${timestamp}.${rawBody}` : rawBody;
      const valid =
        verifyHmacSha256(signedPayload, secret, signature) ||
        verifyHmacSha256(rawBody, secret, signature);
      if (!valid && !fromTwentyDocker) {
        res.status(401).json({ error: "Invalid signature" });
        return;
      }
    } else if (!fromTwentyDocker) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }
  }

  const payload = (typeof req.body === "object" ? req.body : JSON.parse(rawBody)) as Record<string, unknown>;
  const parsed = parseTwentyWebhook(payload as Parameters<typeof parseTwentyWebhook>[0]);
  const eventId = parsed.eventId || randomUUID();
  const tenantId = process.env.TENANT_ID ?? "mhgstrategy";

  if (await isWebhookProcessed("twenty", eventId)) {
    res.status(200).json({ ok: true, skipped: true });
    return;
  }

  void enqueueIntegrationJob({
    tenantId,
    jobName: "inbound.twenty",
    payload,
    correlationId: eventId,
  }).then(() => markWebhookProcessed("twenty", eventId));

  res.status(200).json({ ok: true });
});

webhooksRouter.post("/api/webhooks/plane", async (req, res) => {
  const rawBody = webhookRawBody(req);
  const signature = req.headers["x-plane-signature"];
  const secret = process.env.PLANE_WEBHOOK_SECRET;

  if (process.env.WEBHOOK_MOCK !== "true") {
    if (!secret || typeof signature !== "string" || !verifyPlaneWebhookSignature(rawBody, secret, signature)) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }
  }

  const payload = (typeof req.body === "object" ? req.body : JSON.parse(rawBody)) as Record<string, unknown>;
  const data = payload.data as Record<string, unknown> | undefined;
  const eventId = String(
    payload.id ??
      payload.event_id ??
      `${data?.project_id ?? ""}:${data?.id ?? ""}:${data?.updated_at ?? randomUUID()}`,
  );
  const tenantId = process.env.TENANT_ID ?? "mhgstrategy";

  if (await isWebhookProcessed("plane", eventId)) {
    res.status(200).json({ ok: true, skipped: true });
    return;
  }

  void enqueueIntegrationJob({
    tenantId,
    jobName: "inbound.plane",
    payload,
    correlationId: eventId,
  }).then(() => markWebhookProcessed("plane", eventId));

  res.status(200).json({ ok: true });
});

webhooksRouter.post("/api/webhooks/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

  const { stripeClient, cancelCollections } = await import("@mhg-sync/tools");

  if (process.env.STRIPE_MOCK !== "true" && process.env.WEBHOOK_MOCK !== "true") {
    if (!sig || typeof sig !== "string" || !stripeClient.verifyWebhookSignature(rawBody, sig)) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }
  }

  const event = req.body as {
    type: string;
    data?: { object?: Record<string, unknown> };
  };

  const tenantId = process.env.TENANT_ID ?? "mhgstrategy";

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data?.object ?? {};
    const metadata = (pi.metadata ?? {}) as Record<string, string>;
    const invoiceId = metadata.internalInvoiceId;
    const amount = Number(pi.amount ?? 0) / 100;

    if (invoiceId && isUuid(invoiceId)) {
      try {
        await query(
          `UPDATE invoices SET status = 'paid', paid_at = NOW(), paid_amount = $1, updated_at = NOW() WHERE id = $2 AND tenant_id = $3`,
          [amount, invoiceId, tenantId],
          ["finance"],
        );
        await query(
          `INSERT INTO revenue_records (id, tenant_id, period, mrr, amount, invoice_id, recognized_at, metadata, created_at, updated_at)
           VALUES ($1,$2,to_char(NOW(),'YYYY-MM'),$3,$3,$4,NOW(),$5,NOW(),NOW())`,
          [randomUUID(), tenantId, amount, invoiceId, JSON.stringify({ stripePaymentIntent: pi.id })],
          ["finance"],
        );
        await cancelCollections(invoiceId, tenantId);

        const inv = await query<{ deal_id: string | null; client_id: string | null }>(
          `SELECT deal_id, client_id FROM invoices WHERE id = $1 AND tenant_id = $2`,
          [invoiceId, tenantId],
          ["finance"],
        );
        const dealId = inv.rows[0]?.deal_id;
        if (dealId) {
          await query(
            `UPDATE deals SET invoice_paid_at = NOW(), sop_stage = 'A4', updated_at = NOW() WHERE id = $1 AND tenant_id = $2`,
            [dealId, tenantId],
            ["crm"],
          );
        }
        await eventBus.publish({
          tenantId,
          source: "system",
          eventType: EVENT_TYPES.INVOICE_PAID,
          payload: {
            invoiceId,
            dealId,
            contactId: inv.rows[0]?.client_id,
            amount,
            stripePaymentIntentId: pi.id,
          },
        });
      } catch (err) {
        console.error("Stripe webhook payment_intent.succeeded handler error:", err);
      }
    }
  }

  if (event.type === "invoice.payment_failed") {
    const inv = event.data?.object as { metadata?: Record<string, string> } | undefined;
    const invoiceId = inv?.metadata?.internalInvoiceId;
    if (invoiceId && isUuid(invoiceId)) {
      try {
        await query(
          `UPDATE invoices SET payment_failed = true, updated_at = NOW() WHERE id = $1`,
          [invoiceId],
          ["finance"],
        );
      } catch (err) {
        console.error("Stripe webhook invoice.payment_failed handler error:", err);
      }
    }
  }

  res.status(200).json({ received: true });
});
