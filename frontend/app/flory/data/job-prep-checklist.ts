export type ChecklistGroup = {
  title: string;
  items: { id: string; label: string; detail?: string }[];
};

export const JOB_PREP_GROUPS: ChecklistGroup[] = [
  {
    title: "Application",
    items: [
      { id: "jp-resume", label: "Resume PDF submitted (2-page BPDA version)" },
      { id: "jp-cl", label: "Cover letter PDF submitted" },
      { id: "jp-form", label: "Application form fields complete" },
      { id: "jp-awards", label: "Awards / achievements section pasted" },
    ],
  },
  {
    title: "Positioning",
    items: [
      {
        id: "jp-linkedin",
        label: "LinkedIn titles match resume exactly",
        detail: "Data Analytics & Business Intelligence; not inflated ERP titles.",
      },
      {
        id: "jp-gaps",
        label: "Honest gaps memorized",
        detail: "GP ramp, Power Platform ramp, no Lean belt, Six Sigma/TOC = MBA coursework only.",
      },
    ],
  },
  {
    title: "Logistics",
    items: [
      { id: "jp-start", label: "Start immediately stated in cover letter and form" },
      { id: "jp-local", label: "Salida local hook ready (right across the 99)" },
      { id: "jp-test", label: "Welcome skills test / work sample offer ready" },
    ],
  },
  {
    title: "Study",
    items: [
      { id: "jp-glossary", label: "Glossary skimmed (150 terms)" },
      { id: "jp-bpa", label: "BPA Guide reviewed (GQM, CCC, detective mode)" },
      { id: "jp-phase1", label: "Microsoft Learn Phase 1 started" },
      { id: "jp-applyit", label: "Apply It tab reviewed (Nut Harvester data model)" },
      { id: "jp-projects", label: "Project #1-3 specs read" },
    ],
  },
  {
    title: "Interview day",
    items: [
      { id: "jp-phone", label: "Phone charged; mhgsync.com/flory bookmarked" },
      {
        id: "jp-60sec",
        label: "60-90 second answer discipline",
        detail: "Result first. Mechanism second. Stop when the number closes it.",
      },
    ],
  },
  {
    title: "Post-interview",
    items: [{ id: "jp-thanks", label: "Thank-you note draft ready" }],
  },
];

export const JOB_PREP_IDS = JOB_PREP_GROUPS.flatMap((g) =>
  g.items.map((i) => i.id)
);
