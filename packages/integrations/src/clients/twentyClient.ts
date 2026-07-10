import type { IntegrationResult } from "../types.js";

function baseUrl(): string {
  return (process.env.TWENTY_API_URL ?? "https://crm.mhgstrategy.com").replace(/\/$/, "");
}

function apiKey(): string {
  return process.env.TWENTY_API_KEY ?? "";
}

async function graphql<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<{ data?: T; errors?: Array<{ message: string }> }> {
  const url = `${baseUrl()}/graphql`;
  console.log("[TWENTY_CLIENT] POST", url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("[TWENTY_CLIENT] HTTP error", res.status, text.slice(0, 200));
    return { errors: [{ message: `HTTP ${res.status}: ${text.slice(0, 200)}` }] };
  }

  try {
    return JSON.parse(text) as { data?: T; errors?: Array<{ message: string }> };
  } catch {
    return { errors: [{ message: "Invalid JSON response" }] };
  }
}

export async function createOpportunity(input: {
  name: string;
  amount?: number;
  stage?: string;
  pointOfContactId?: string;
}): Promise<IntegrationResult> {
  const result = await graphql<{ createOpportunity: { id: string } }>(
    `mutation CreateOpportunity($input: OpportunityCreateInput!) {
      createOpportunity(data: $input) { id }
    }`,
    {
      input: {
        name: input.name,
        // Twenty rejects amount: 0 — omit until a value is set
        ...(input.amount != null && input.amount > 0 ? { amount: input.amount } : {}),
        stage: input.stage,
        ...(input.pointOfContactId ? { pointOfContactId: input.pointOfContactId } : {}),
      },
    },
  );

  if (result.errors?.length) {
    return { success: false, error: result.errors.map((e) => e.message).join("; ") };
  }
  const id = result.data?.createOpportunity?.id;
  return id ? { success: true, externalId: id } : { success: false, error: "No opportunity id returned" };
}

export async function updateOpportunity(input: {
  id: string;
  name?: string;
  amount?: number;
  stage?: string;
  pointOfContactId?: string;
}): Promise<IntegrationResult> {
  const result = await graphql<{ updateOpportunity: { id: string } }>(
    `mutation UpdateOpportunity($id: UUID!, $input: OpportunityUpdateInput!) {
      updateOpportunity(id: $id, data: $input) { id }
    }`,
    {
      id: input.id,
      input: {
        name: input.name,
        ...(input.amount != null && input.amount > 0 ? { amount: input.amount } : {}),
        stage: input.stage,
        ...(input.pointOfContactId ? { pointOfContactId: input.pointOfContactId } : {}),
      },
    },
  );

  if (result.errors?.length) {
    return { success: false, error: result.errors.map((e) => e.message).join("; ") };
  }
  const id = result.data?.updateOpportunity?.id;
  return id ? { success: true, externalId: id } : { success: false, error: "No opportunity id returned" };
}

export async function createContact(input: {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
}): Promise<IntegrationResult> {
  const result = await graphql<{ createPerson: { id: string } }>(
    `mutation CreatePerson($input: PersonCreateInput!) {
      createPerson(data: $input) { id }
    }`,
    {
      input: {
        name: { firstName: input.firstName, lastName: input.lastName ?? "" },
        emails: input.email ? { primaryEmail: input.email } : undefined,
        phones: input.phone ? { primaryPhoneNumber: input.phone } : undefined,
      },
    },
  );

  if (result.errors?.length) {
    return { success: false, error: result.errors.map((e) => e.message).join("; ") };
  }
  const id = result.data?.createPerson?.id;
  return id ? { success: true, externalId: id } : { success: false, error: "No person id returned" };
}

export async function updateContact(input: {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}): Promise<IntegrationResult> {
  const result = await graphql<{ updatePerson: { id: string } }>(
    `mutation UpdatePerson($id: UUID!, $input: PersonUpdateInput!) {
      updatePerson(id: $id, data: $input) { id }
    }`,
    {
      id: input.id,
      input: {
        name:
          input.firstName !== undefined
            ? { firstName: input.firstName, lastName: input.lastName ?? "" }
            : undefined,
        emails: input.email ? { primaryEmail: input.email } : undefined,
        phones: input.phone ? { primaryPhoneNumber: input.phone } : undefined,
      },
    },
  );

  if (result.errors?.length) {
    return { success: false, error: result.errors.map((e) => e.message).join("; ") };
  }
  const id = result.data?.updatePerson?.id;
  return id ? { success: true, externalId: id } : { success: false, error: "No person id returned" };
}

const INTAKE_NOTE_TITLE = "Intake Questionnaire";

async function findIntakeQuestionnaireNoteId(opportunityId: string): Promise<string | null> {
  const result = await graphql<{
    opportunities: {
      edges: Array<{
        node: {
          noteTargets: {
            edges: Array<{ node: { noteId: string; note: { id: string; title: string | null } | null } }>;
          };
        };
      }>;
    };
  }>(
    `query OpportunityNotes($filter: OpportunityFilterInput!) {
      opportunities(filter: $filter, first: 1) {
        edges {
          node {
            noteTargets {
              edges {
                node {
                  noteId
                  note { id title }
                }
              }
            }
          }
        }
      }
    }`,
    { filter: { id: { eq: opportunityId } } },
  );

  if (result.errors?.length) return null;

  for (const edge of result.data?.opportunities.edges ?? []) {
    for (const noteEdge of edge.node.noteTargets.edges ?? []) {
      const note = noteEdge.node.note;
      if (note?.title === INTAKE_NOTE_TITLE) return note.id;
    }
  }
  return null;
}

/** Attach or refresh the formatted intake questionnaire on a Twenty opportunity. */
export async function upsertIntakeQuestionnaireNote(input: {
  opportunityId: string;
  markdown: string;
}): Promise<IntegrationResult> {
  const existingNoteId = await findIntakeQuestionnaireNoteId(input.opportunityId);

  if (existingNoteId) {
    const result = await graphql<{ updateNote: { id: string } }>(
      `mutation UpdateNote($id: UUID!, $input: NoteUpdateInput!) {
        updateNote(id: $id, data: $input) { id }
      }`,
      {
        id: existingNoteId,
        input: {
          title: INTAKE_NOTE_TITLE,
          bodyV2: { markdown: input.markdown },
        },
      },
    );
    if (result.errors?.length) {
      return { success: false, error: result.errors.map((e) => e.message).join("; ") };
    }
    const id = result.data?.updateNote?.id;
    return id ? { success: true, externalId: id } : { success: false, error: "No note id returned" };
  }

  const createResult = await graphql<{ createNote: { id: string } }>(
    `mutation CreateNote($input: NoteCreateInput!) {
      createNote(data: $input) { id }
    }`,
    {
      input: {
        title: INTAKE_NOTE_TITLE,
        bodyV2: { markdown: input.markdown },
      },
    },
  );

  if (createResult.errors?.length) {
    return { success: false, error: createResult.errors.map((e) => e.message).join("; ") };
  }

  const noteId = createResult.data?.createNote?.id;
  if (!noteId) return { success: false, error: "No note id returned" };

  const linkResult = await graphql<{ createNoteTarget: { id: string } }>(
    `mutation CreateNoteTarget($input: NoteTargetCreateInput!) {
      createNoteTarget(data: $input) { id }
    }`,
    {
      input: {
        noteId,
        targetOpportunityId: input.opportunityId,
      },
    },
  );

  if (linkResult.errors?.length) {
    return { success: false, error: linkResult.errors.map((e) => e.message).join("; ") };
  }

  return { success: true, externalId: noteId };
}

/** @deprecated Use upsertIntakeQuestionnaireNote — Twenty notes no longer accept `body`. */
export async function createNote(input: {
  opportunityId: string;
  body: string;
}): Promise<IntegrationResult> {
  return upsertIntakeQuestionnaireNote({
    opportunityId: input.opportunityId,
    markdown: input.body,
  });
}
