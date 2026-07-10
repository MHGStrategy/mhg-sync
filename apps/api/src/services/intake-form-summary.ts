export type IntakeFormField = {
  id?: string;
  label?: string;
  value?: string;
  rawValue?: string | string[] | null;
  isUpsellSignal?: boolean;
};

function fieldDisplayValue(field: IntakeFormField): string {
  const value = field.value?.trim();
  if (value) return value;

  const raw = field.rawValue;
  if (Array.isArray(raw)) {
    const joined = raw.map((item) => String(item).trim()).filter(Boolean).join(", ");
    if (joined) return joined;
  } else if (typeof raw === "string" && raw.trim()) {
    return raw.trim();
  }

  return "—";
}

export type IntakeFormSection = {
  id?: string;
  title?: string;
  fields?: IntakeFormField[];
};

/** Flatten discovery questionnaire sections/fields into CRM-ready text. */
export function formatIntakeQuestionnaire(
  formData: Record<string, unknown>,
  opts?: { formType?: string; dashboardId?: string; dashboardBaseUrl?: string },
): string {
  const lines: string[] = [];

  if (opts?.formType) {
    lines.push(`Form type: ${opts.formType}`);
  }
  if (opts?.dashboardId) {
    const base = (opts.dashboardBaseUrl ?? "https://mhgsync.com").replace(/\/$/, "");
    lines.push(`Discovery dashboard: ${base}/${opts.dashboardId}`);
  }
  if (lines.length) lines.push("");

  const sections = (formData.sections as IntakeFormSection[] | undefined) ?? [];
  if (!sections.length) {
    const fallback = JSON.stringify(formData, null, 2);
    return lines.length ? `${lines.join("\n")}\n${fallback}` : fallback;
  }

  for (const section of sections) {
    if (section.title) {
      lines.push(`## ${section.title}`);
    }
    for (const field of section.fields ?? []) {
      const label = field.label?.trim() || "Question";
      const value = fieldDisplayValue(field);
      const tag = field.isUpsellSignal ? " [improvement area]" : "";
      lines.push(`${label}${tag}: ${value}`);
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}

export function intakeActivityMetadata(input: {
  formType: string;
  dashboardId?: string;
  formData?: Record<string, unknown>;
}): Record<string, unknown> {
  const metadata: Record<string, unknown> = {
    formType: input.formType,
    dashboardId: input.dashboardId,
  };
  if (input.formData && Object.keys(input.formData).length > 0) {
    metadata.formData = input.formData;
    metadata.summary = formatIntakeQuestionnaire(input.formData, {
      formType: input.formType,
      dashboardId: input.dashboardId,
      dashboardBaseUrl: process.env.DASHBOARD_BASE_URL,
    });
  }
  return metadata;
}
