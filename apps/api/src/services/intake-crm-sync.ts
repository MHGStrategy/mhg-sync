import { randomUUID } from "node:crypto";
import { query } from "@mhg-sync/db";
import { eventBus, EVENT_TYPES } from "@mhg-sync/agents";
import { formatIntakeQuestionnaire, intakeActivityMetadata } from "./intake-form-summary.js";

export interface IntakeCrmSyncInput {
  tenantId: string;
  clientEmail: string;
  clientName: string;
  formType: string;
  dashboardId?: string;
  formData?: Record<string, unknown>;
}

export interface IntakeCrmSyncResult {
  contactId: string;
  dealId: string | null;
}

const DEFAULT_STAGES = [
  { name: "Lead", sortOrder: 1 },
  { name: "Qualified", sortOrder: 2 },
  { name: "Proposal", sortOrder: 3 },
  { name: "Closed Won", sortOrder: 4 },
] as const;

async function ensureDealStages(tenantId: string): Promise<string> {
  for (const stage of DEFAULT_STAGES) {
    const existing = await query<{ id: string }>(
      `SELECT id FROM deal_stages WHERE tenant_id = $1 AND name = $2 LIMIT 1`,
      [tenantId, stage.name],
      ["crm"],
    );
    if (!existing.rows[0]) {
      await query(
        `INSERT INTO deal_stages (id, tenant_id, name, sort_order, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [randomUUID(), tenantId, stage.name, stage.sortOrder],
        ["crm"],
      );
    }
  }

  const leadStage = await query<{ id: string }>(
    `SELECT id FROM deal_stages WHERE tenant_id = $1 AND name = 'Lead' LIMIT 1`,
    [tenantId],
    ["crm"],
  );
  return leadStage.rows[0]!.id;
}

function formatFormType(formType: string): string {
  if (formType === "real-estate") return "Real Estate";
  if (formType === "ministry") return "Ministry";
  return formType.charAt(0).toUpperCase() + formType.slice(1);
}

function questionnaireNotes(input: IntakeCrmSyncInput): string | undefined {
  if (!input.formData || Object.keys(input.formData).length === 0) return undefined;
  return formatIntakeQuestionnaire(input.formData, {
    formType: input.formType,
    dashboardId: input.dashboardId,
    dashboardBaseUrl: process.env.DASHBOARD_BASE_URL,
  });
}

async function recordIntakeActivity(
  tenantId: string,
  dealId: string,
  contactId: string,
  input: IntakeCrmSyncInput,
): Promise<void> {
  const metadata = intakeActivityMetadata({
    formType: input.formType,
    dashboardId: input.dashboardId,
    formData: input.formData,
  });

  const existing = await query<{ id: string }>(
    `SELECT id FROM activities
     WHERE tenant_id = $1 AND deal_id = $2 AND type = 'intake'
     ORDER BY created_at DESC LIMIT 1`,
    [tenantId, dealId],
    ["crm"],
  );

  if (existing.rows[0]) {
    await query(
      `UPDATE activities SET metadata = $1, notes = $2, updated_at = NOW() WHERE id = $3`,
      [
        JSON.stringify(metadata),
        metadata.summary ? String(metadata.summary).slice(0, 500) : "Discovery form submitted",
        existing.rows[0].id,
      ],
      ["crm"],
    );
    return;
  }

  await query(
    `INSERT INTO activities (id, tenant_id, deal_id, contact_id, type, notes, metadata, created_at, updated_at)
     VALUES ($1,$2,$3,$4,'intake',$5,$6,NOW(),NOW())`,
    [
      randomUUID(),
      tenantId,
      dealId,
      contactId,
      metadata.summary ? String(metadata.summary).slice(0, 500) : "Discovery form submitted",
      JSON.stringify(metadata),
    ],
    ["crm"],
  );
}

async function pushDealToTwenty(
  tenantId: string,
  dealId: string,
  input: { sopStage: string; title: string; notes?: string },
): Promise<void> {
  const { enqueueIntegrationJob } = await import("@mhg-sync/integrations");
  await enqueueIntegrationJob({
    tenantId,
    jobName: "crm.deal.upsert",
    payload: {
      dealId,
      sopStage: input.sopStage,
      clientName: input.title,
      notes: input.notes,
    },
    correlationId: randomUUID(),
  });
}

/** Upsert CRM contact + Lead-stage deal for an intake submission. */
export async function syncIntakeToCrm(input: IntakeCrmSyncInput): Promise<IntakeCrmSyncResult> {
  const nameParts = input.clientName.trim().split(/\s+/);
  const firstName = nameParts[0] ?? null;
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;
  const notes = questionnaireNotes(input);

  const existing = await query<{ id: string }>(
    `SELECT id FROM contacts WHERE tenant_id = $1 AND LOWER(email) = LOWER($2) LIMIT 1`,
    [input.tenantId, input.clientEmail],
    ["crm"],
  );

  let contactId = existing.rows[0]?.id;
  let contactCreated = false;
  if (!contactId) {
    contactId = randomUUID();
    contactCreated = true;
    await query(
      `INSERT INTO contacts (id, tenant_id, first_name, last_name, email, lead_source, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,'intake','lead',NOW(),NOW())`,
      [contactId, input.tenantId, firstName, lastName, input.clientEmail],
      ["crm"],
    );
  } else {
    await query(
      `UPDATE contacts
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           lead_source = COALESCE(lead_source, 'intake'),
           status = COALESCE(status, 'lead'),
           updated_at = NOW()
       WHERE id = $3`,
      [firstName, lastName, contactId],
      ["crm"],
    );
  }

  if (contactCreated) {
    await eventBus.publish({
      tenantId: input.tenantId,
      source: "system",
      eventType: EVENT_TYPES.CONTACT_CREATED,
      payload: {
        contactId,
        name: input.clientName,
        email: input.clientEmail,
      },
      correlationId: randomUUID(),
    });
  }

  if (!input.dashboardId) {
    return { contactId, dealId: null };
  }

  const existingDeal = await query<{ id: string; title: string; sop_stage: string }>(
    `SELECT id, title, sop_stage FROM deals WHERE tenant_id = $1 AND intake_dashboard_id = $2 LIMIT 1`,
    [input.tenantId, input.dashboardId],
    ["crm"],
  );

  if (existingDeal.rows[0]) {
    const deal = existingDeal.rows[0];
    await recordIntakeActivity(input.tenantId, deal.id, contactId, input);
    if (notes) {
      await pushDealToTwenty(input.tenantId, deal.id, {
        sopStage: deal.sop_stage,
        title: deal.title,
        notes,
      });
    }
    return { contactId, dealId: deal.id };
  }

  const leadStageId = await ensureDealStages(input.tenantId);
  const dealTitle = `${input.clientName.trim() || input.clientEmail} — ${formatFormType(input.formType)} Discovery`;
  const dealId = randomUUID();

  await query(
    `INSERT INTO deals (
       id, tenant_id, title, stage_id, value, probability, contact_id,
       intake_dashboard_id, sop_stage, created_at, updated_at
     ) VALUES ($1,$2,$3,$4,NULL,10,$5,$6,'A1',NOW(),NOW())`,
    [dealId, input.tenantId, dealTitle, leadStageId, contactId, input.dashboardId],
    ["crm"],
  );

  await recordIntakeActivity(input.tenantId, dealId, contactId, input);

  await eventBus.publish({
    tenantId: input.tenantId,
    source: "system",
    eventType: EVENT_TYPES.DEAL_STAGE_CHANGED,
    payload: { dealId, sopStage: "A1", title: dealTitle, notes },
    correlationId: randomUUID(),
  });

  return { contactId, dealId };
}
