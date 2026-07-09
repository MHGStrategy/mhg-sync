import { randomUUID } from "node:crypto";
import { Queue, Worker, type Job } from "bullmq";
import { query } from "@mhg-sync/db";
import { connectRedis } from "@mhg-sync/memory";
import { TWENTY_FIELD_MAP, PLANE_FIELD_MAP } from "../constants/fieldMaps.js";
import * as twentyClient from "../clients/twentyClient.js";
import * as planeClient from "../clients/planeClient.js";
import { resolveScopeItemTitles } from "../scope-items.js";
import { dealEchoKey, taskEchoKey, contactEchoKey, hasEchoLock } from "../echo-lock.js";
import { handleTwentyInbound } from "./inbound/twentyHandler.js";
import { handlePlaneInbound } from "./inbound/planeHandler.js";
import type {
  IntegrationJobPayload,
  CrmDealUpsertPayload,
  CrmContactUpsertPayload,
  PmProjectCreatePayload,
  PmIssueSyncPayload,
} from "../types.js";

const QUEUE_NAME = "mhg-sync-integrations";

function redisConnection() {
  return {
    host: process.env.REDIS_HOST ?? "127.0.0.1",
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
  };
}

let queue: Queue<IntegrationJobPayload> | null = null;
let worker: Worker<IntegrationJobPayload> | null = null;

async function writeIntegrationDeadLetter(
  tenantId: string,
  jobName: string,
  payload: Record<string, unknown>,
  error: string,
  attemptCount: number,
): Promise<void> {
  const now = new Date();
  await query(
    `INSERT INTO dead_letter_queue (
      id, tenant_id, task_id, agent_domain, task_type, original_payload,
      failure_reason, attempt_count, first_failed_at, last_failed_at, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [
      randomUUID(),
      tenantId,
      randomUUID(),
      "integrations",
      jobName,
      JSON.stringify(payload),
      error,
      attemptCount,
      now.toISOString(),
      now.toISOString(),
      "open",
    ],
    ["system"],
  );
}

async function handleCrmDealUpsert(tenantId: string, payload: CrmDealUpsertPayload): Promise<void> {
  if (await hasEchoLock(dealEchoKey(payload.dealId))) {
    console.log("[INTEGRATION] Skipping crm.deal.upsert — echo lock", payload.dealId);
    return;
  }

  const deal = await query<{
    id: string;
    title: string;
    value: string | null;
    sop_stage: string;
    owner_id: string | null;
    twenty_id: string | null;
    contact_id: string | null;
  }>(
    `SELECT id, title, value, sop_stage, owner_id, twenty_id, contact_id FROM deals WHERE id = $1 AND tenant_id = $2`,
    [payload.dealId, tenantId],
    ["crm"],
  );

  const row = deal.rows[0];
  if (!row) throw new Error(`Deal not found: ${payload.dealId}`);

  const sopStage = payload.sopStage ?? row.sop_stage;
  const twentyStage =
    TWENTY_FIELD_MAP.sopToTwentyStage[sopStage as keyof typeof TWENTY_FIELD_MAP.sopToTwentyStage] ??
    "NEW";

  const rawAmount =
    payload.dealValue != null
      ? Number(payload.dealValue)
      : row.value != null
        ? Number(row.value)
        : undefined;
  const amount = rawAmount != null && rawAmount > 0 ? rawAmount : undefined;
  const name = payload.clientName ?? row.title;

  let questionnaireMarkdown = payload.notes;
  if (!questionnaireMarkdown) {
    const activity = await query<{ metadata: Record<string, unknown> | string | null }>(
      `SELECT metadata FROM activities
       WHERE deal_id = $1 AND tenant_id = $2 AND type = 'intake'
       ORDER BY created_at DESC LIMIT 1`,
      [row.id, tenantId],
      ["crm"],
    );
    const raw = activity.rows[0]?.metadata;
    const metadata =
      typeof raw === "string"
        ? (JSON.parse(raw) as Record<string, unknown>)
        : (raw as Record<string, unknown> | null);
    if (metadata?.summary && typeof metadata.summary === "string") {
      questionnaireMarkdown = metadata.summary;
    }
  }

  let pointOfContactId: string | undefined;
  if (row.contact_id) {
    const contact = await query<{ twenty_contact_id: string | null }>(
      `SELECT twenty_contact_id FROM contacts WHERE id = $1 AND tenant_id = $2`,
      [row.contact_id, tenantId],
      ["crm"],
    );
    pointOfContactId = contact.rows[0]?.twenty_contact_id ?? undefined;
  }

  let result;
  let opportunityId = row.twenty_id;
  if (row.twenty_id) {
    result = await twentyClient.updateOpportunity({
      id: row.twenty_id,
      name,
      amount,
      stage: twentyStage,
      pointOfContactId,
    });
  } else {
    result = await twentyClient.createOpportunity({
      name,
      amount,
      stage: twentyStage,
      pointOfContactId,
    });
    if (result.success && result.externalId) {
      opportunityId = result.externalId;
      await query(
        `UPDATE deals SET twenty_id = $1, updated_at = NOW() WHERE id = $2 AND tenant_id = $3`,
        [result.externalId, row.id, tenantId],
        ["crm"],
      );
    }
  }

  if (!result.success) throw new Error(result.error ?? "Twenty deal upsert failed");

  if (questionnaireMarkdown?.trim() && opportunityId) {
    const noteResult = await twentyClient.upsertIntakeQuestionnaireNote({
      opportunityId,
      markdown: questionnaireMarkdown,
    });
    if (!noteResult.success) {
      throw new Error(noteResult.error ?? "Twenty intake questionnaire note failed");
    }
  }
}

async function handleCrmContactUpsert(tenantId: string, payload: CrmContactUpsertPayload): Promise<void> {
  if (await hasEchoLock(contactEchoKey(payload.contactId))) {
    console.log("[INTEGRATION] Skipping crm.contact.upsert — echo lock", payload.contactId);
    return;
  }

  const contact = await query<{
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    twenty_contact_id: string | null;
  }>(
    `SELECT id, first_name, last_name, email, phone, twenty_contact_id FROM contacts WHERE id = $1 AND tenant_id = $2`,
    [payload.contactId, tenantId],
    ["crm"],
  );

  const row = contact.rows[0];
  if (!row) throw new Error(`Contact not found: ${payload.contactId}`);

  const nameParts = (payload.name ?? `${row.first_name ?? ""} ${row.last_name ?? ""}`).trim().split(/\s+/);
  const firstName = nameParts[0] ?? "Contact";
  const lastName = nameParts.slice(1).join(" ");
  const email = payload.email ?? row.email ?? undefined;
  const phone = payload.phone ?? row.phone ?? undefined;

  let result;
  if (row.twenty_contact_id) {
    result = await twentyClient.updateContact({
      id: row.twenty_contact_id,
      firstName,
      lastName,
      email,
      phone,
    });
  } else {
    result = await twentyClient.createContact({ firstName, lastName, email, phone });
    if (result.success && result.externalId) {
      await query(
        `UPDATE contacts SET twenty_contact_id = $1, updated_at = NOW() WHERE id = $2 AND tenant_id = $3`,
        [result.externalId, row.id, tenantId],
        ["crm"],
      );
    }
  }

  if (!result.success) throw new Error(result.error ?? "Twenty contact upsert failed");
}

async function handlePmProjectCreate(tenantId: string, payload: PmProjectCreatePayload): Promise<void> {
  const deal = await query<{
    id: string;
    title: string;
    plane_project_id: string | null;
    invoice_paid_at: string | null;
  }>(
    `SELECT id, title, plane_project_id, invoice_paid_at FROM deals WHERE id = $1 AND tenant_id = $2`,
    [payload.dealId, tenantId],
    ["crm"],
  );

  const row = deal.rows[0];
  if (!row) throw new Error(`Deal not found: ${payload.dealId}`);
  if (!row.invoice_paid_at) {
    console.warn("[INTEGRATION] pm.project.create skipped — no confirmed payment", payload.dealId);
    return;
  }
  if (row.plane_project_id) {
    console.log("[INTEGRATION] Plane project already exists for deal", payload.dealId);
    return;
  }

  const clientName = payload.clientName ?? row.title;
  const projectResult = await planeClient.createProject({
    name: clientName,
    identifier: payload.dealId.slice(0, 8).toUpperCase(),
    description: `MHG SYNC deal ${payload.dealId}`,
  });

  if (!projectResult.success || !projectResult.externalId) {
    throw new Error(projectResult.error ?? "Plane project create failed");
  }

  const projectId = projectResult.externalId;
  await query(
    `UPDATE deals SET plane_project_id = $1, updated_at = NOW() WHERE id = $2 AND tenant_id = $3`,
    [projectId, row.id, tenantId],
    ["crm"],
  );

  const scopeItems = await resolveScopeItemTitles(tenantId, payload.dealId);
  for (const title of scopeItems) {
    await planeClient.createIssue({
      projectId,
      name: title,
      description: `Deliverable for ${clientName}`,
      priority: "medium",
    });
  }
}

async function handlePmIssueSync(tenantId: string, payload: PmIssueSyncPayload): Promise<void> {
  if (await hasEchoLock(taskEchoKey(payload.taskId))) {
    console.log("[INTEGRATION] Skipping pm.issue.sync — echo lock", payload.taskId);
    return;
  }

  const task = await query<{
    id: string;
    plane_issue_id: string | null;
    status: string;
    project_id: string | null;
  }>(
    `SELECT id, plane_issue_id, status, project_id FROM tasks WHERE id = $1 AND tenant_id = $2`,
    [payload.taskId, tenantId],
    ["ops"],
  );

  const row = task.rows[0];
  const planeIssueId = payload.planeIssueId ?? row?.plane_issue_id;
  if (!row || !planeIssueId) {
    console.log("[INTEGRATION] No plane_issue_id for task", payload.taskId);
    return;
  }

  const deal = await query<{ plane_project_id: string | null }>(
    `SELECT plane_project_id FROM deals WHERE kickoff_project_id = $1 AND tenant_id = $2 LIMIT 1`,
    [row.project_id, tenantId],
    ["crm"],
  );
  const projectId = deal.rows[0]?.plane_project_id;
  if (!projectId) {
    console.log("[INTEGRATION] No plane_project_id linked to task project", payload.taskId);
    return;
  }

  const planeState =
    PLANE_FIELD_MAP.syncToPlaneStatus[payload.status as keyof typeof PLANE_FIELD_MAP.syncToPlaneStatus] ??
    "Todo";

  const result = await planeClient.updateIssue({
    projectId,
    issueId: planeIssueId,
    state: planeState,
  });

  if (!result.success) throw new Error(result.error ?? "Plane issue sync failed");
}

async function dispatchJob(job: IntegrationJobPayload): Promise<void> {
  const { tenantId, jobName, payload } = job;

  switch (jobName) {
    case "crm.deal.upsert":
      await handleCrmDealUpsert(tenantId, payload as CrmDealUpsertPayload);
      break;
    case "crm.contact.upsert":
      await handleCrmContactUpsert(tenantId, payload as CrmContactUpsertPayload);
      break;
    case "pm.project.create":
      await handlePmProjectCreate(tenantId, payload as PmProjectCreatePayload);
      break;
    case "pm.issue.sync":
      await handlePmIssueSync(tenantId, payload as PmIssueSyncPayload);
      break;
    case "inbound.twenty":
      await handleTwentyInbound(tenantId, payload);
      break;
    case "inbound.plane":
      await handlePlaneInbound(tenantId, payload);
      break;
    default:
      console.warn("[INTEGRATION] Unknown job:", jobName);
  }
}

export async function enqueueIntegrationJob(job: IntegrationJobPayload): Promise<void> {
  if (process.env.SKIP_REDIS_EVENTS === "true") {
    await dispatchJob(job);
    return;
  }
  if (!queue) {
    await connectRedis();
    queue = new Queue<IntegrationJobPayload>(QUEUE_NAME, { connection: redisConnection() });
  }
  await queue.add(job.jobName, job, {
    jobId: randomUUID(),
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  });
}

export async function startIntegrationWorker(): Promise<void> {
  if (process.env.SKIP_REDIS_EVENTS === "true") return;
  if (worker) return;

  await connectRedis();
  const connection = redisConnection();
  queue = new Queue<IntegrationJobPayload>(QUEUE_NAME, { connection });

  worker = new Worker<IntegrationJobPayload>(
    QUEUE_NAME,
    async (job: Job<IntegrationJobPayload>) => {
      await dispatchJob(job.data);
    },
    { connection },
  );

  worker.on("failed", async (job, err) => {
    if (!job) return;
    const attempts = job.opts.attempts ?? 1;
    if (job.attemptsMade >= attempts) {
      console.error("[INTEGRATION] Job failed permanently:", job.data.jobName, err.message);
      await writeIntegrationDeadLetter(
        job.data.tenantId,
        job.data.jobName,
        job.data.payload,
        err.message,
        job.attemptsMade,
      );
    }
  });
}

export async function stopIntegrationWorker(): Promise<void> {
  await worker?.close();
  await queue?.close();
  worker = null;
  queue = null;
}
