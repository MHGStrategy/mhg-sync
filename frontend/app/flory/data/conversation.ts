export type EvolutionRow = { today: string; future: string };

export const SERVICE_EVOLUTION_TABLE: EvolutionRow[] = [
  { today: "Customer calls when equipment fails", future: "Equipment generates a service alert" },
  { today: "Scheduled preventive maintenance", future: "Predictive maintenance from actual condition" },
  { today: "Technician diagnoses onsite", future: "AI pre-diagnoses before arrival" },
  { today: "Technician carries common parts", future: "System predicts and stages parts" },
  { today: "Service ticket created manually", future: "IoT event creates work order" },
  { today: "Customer asks for status", future: "Customer sees equipment health in portal" },
  { today: "Revenue tied to repairs", future: "Recurring revenue from monitoring and contracts" },
];

export const SUCCESS_TODAY = [
  "Document as-is before recommending to-be; run reconciliations before accepting narratives.",
  "Own the data quality loop: where transactions are created, who enters them, what breaks downstream.",
  "Support GP users on inventory, manufacturing, and reporting (SmartList → SQL → Power BI).",
  "Deliver BPA on high-value processes: scheduling, quality hold, work order flow, parts availability.",
  "Build operational dashboards leadership uses for decisions (GQM: goal → question → metric).",
  "Translate stakeholder requests into specs; communicate progress and risk without surprises.",
  "Ramp GP modules and plant Lean language on site; bring SQL, Python, Power BI, and CI outcomes now.",
];

export const GP365_EVOLUTION = [
  "GP is system of record today; D365 SCM is the strategic growth platform for Flory's manufacturing depth.",
  "What changes: module names, cloud reporting, Power Platform depth, migration and data cleanup projects.",
  "What stays: process thinking, transaction traceability, BOM/MRP/inventory models, SQL against ERP data, BPA lifecycle.",
  "Your value in transition: map as-is GP workflows before configuring to-be D365; build parallel reporting; document UDFs and workarounds before they become migration debt.",
];

export type GpLifecycleMilestone = { date: string; label: string; detail: string };

export const GP_LIFECYCLE_MILESTONES: GpLifecycleMilestone[] = [
  {
    date: "December 31, 2029",
    label: "Mainstream support ends",
    detail:
      "No new product enhancements, regulatory or tax updates, or Microsoft technical support after this date.",
  },
  {
    date: "April 30, 2031",
    label: "Security coverage window",
    detail:
      "Security updates and patches may continue through this date if needed. Plan around 2029 for product and compliance risk, not 2031 alone.",
  },
];

export const GP_PAGE_SUMMARY =
  "Microsoft's Dynamics GP documentation page is no longer just product help. It is a migration planning notice: GP is in its final lifecycle phase, and customers should start transition planning now.";

export const GP_WHAT_STOPS_AFTER_2029 = [
  "New product enhancements",
  "Regulatory and tax updates",
  "Microsoft technical support",
];

export const GP_TRANSITION_REALITY = [
  "GP is often deeply embedded: years of financial data, customizations, integrations, reports, workflows, and plant-specific procedures.",
  "Microsoft is not saying turn off GP and turn on a cloud ERP overnight. Partners and qualified implementers help build a migration strategy.",
  "Support continues to the best of Microsoft's ability before 2029, but investment in GP will gradually constrain. Do not assume historical update cadence forever.",
  "SPLA subscription licensing has separate end dates. Licensing and subscription arrangements need review alongside technical support timelines.",
];

export const GP_MICROSOFT_RECOMMENDED_PATH = {
  product: "Dynamics 365 Business Central",
  reasons: [
    "Cloud-based infrastructure and modern security",
    "Deeper Microsoft ecosystem integration",
    "AI capabilities and modern analytics",
    "Easier remote access and more frequent platform updates",
  ],
  caveat:
    "Microsoft's default SMB destination is Business Central. Flory runs discrete manufacturing on GP with inventory, purchasing, and shop-floor complexity. Leadership may evaluate D365 Supply Chain Management for manufacturing depth. In interview: support GP now; help map as-is processes and data so any migration is deliberate, not reactive.",
};

export const GP_MIGRATION_SCOPE = [
  "ERP processes and business rules",
  "Financial and operational data",
  "Customizations and third-party applications",
  "Integrations and reporting",
  "Workflows and user roles",
  "Historical data and compliance requirements",
  "Employee training and adoption",
  "What to replicate vs. what to redesign or automate during migration",
];

export type GpResourceLink = { label: string; url: string; note: string };

export const GP_MICROSOFT_RESOURCES: GpResourceLink[] = [
  {
    label: "Dynamics GP Resource Directory",
    url: "https://learn.microsoft.com/en-us/dynamics-gp/resources",
    note: "Documentation hub, blogs, downloads, and community links in one place.",
  },
  {
    label: "Dynamics GP documentation",
    url: "https://learn.microsoft.com/en-us/dynamics-gp/",
    note: "Product help, lifecycle notice, and migration guidance on Microsoft Learn.",
  },
  {
    label: "Dynamics GP Support and Services blog",
    url: "https://community.dynamics.com/gp/b/dynamicsgp",
    note: "Updates, tips, year-end processing, and practical GP topics.",
  },
];

export const GP_VERSION_NOTE =
  "Current Dynamics GP version 18.x follows Microsoft's Modern Lifecycle Policy. GP is managed on a defined end date, not as indefinitely supported legacy software.";

export const GP_STRATEGIC_QUESTION =
  "The strategic question is not only how long we can keep GP. It is what our migration strategy is, which platform fits our manufacturing model, and when we start executing.";

export const GP365_INTERVIEW_LINE =
  "I can support GP operations now and help leadership make the migration deliberate rather than reactive.";

export const IOT_FOUNDATION = [
  "Temperature, vibration, motor current, pressure, RPM, hydraulic conditions",
  "Runtime, cycle counts, energy consumption, error codes, component wear",
  "Data to cloud platform; value is what happens after collection",
];

export const AI_FAILURE_EXAMPLE =
  "Flory detects abnormal vibration on a harvester motor. Historical pattern suggests 82% probability of bearing failure within 30 days. System notifies customer, creates service case, identifies component, checks parts inventory, recommends service date, dispatches technician with history and likely diagnosis.";

export const TECHNICIAN_BRIEFING = `Asset: Conveyor #4 (example pattern)
Issue: Abnormal vibration
Predicted failure: Drive bearing
Confidence: 87%
Previous repair: Bearing replaced 14 months ago
Recommended parts: 6205 bearing x 2
Estimated repair: 2.5 hours`;

export const EQUIPMENT_DASHBOARD_ROWS = [
  { asset: "Harvester #1", status: "Normal", health: "94%", action: "—" },
  { asset: "Harvester #2", status: "Warning", health: "71%", action: "Inspect" },
  { asset: "Sweeper #3", status: "Normal", health: "91%", action: "—" },
  { asset: "Harvester #4", status: "Critical", health: "43%", action: "Service recommended" },
];

export const RECURRING_TIERS = [
  {
    name: "Flory Connected",
    includes: [
      "IoT monitoring",
      "Equipment health score",
      "Automated alerts",
      "Predictive maintenance signals",
      "Service notifications",
      "Customer dashboard",
    ],
  },
  {
    name: "Flory Intelligent Service",
    includes: [
      "Everything in Connected",
      "AI diagnostics",
      "Automatic service scheduling",
      "Priority technician response",
      "Parts forecasting",
      "Maintenance optimization",
      "Performance reporting",
    ],
  },
];

export const CLOSED_LOOP =
  "Machine → IoT → Data → AI → CRM → Service → Technician → Customer";

export const STRATEGIC_PITCH =
  "Flory has an opportunity to turn its service operation into a connected, data-driven customer experience. That is not a technology project. It is a business model shift from break-fix to predict-and-optimize, and it runs on the same process discipline and data quality this role builds today.";

export const WHEN_TO_USE_PITCH = [
  "Strategic or forward-looking questions",
  "\"Where do you see the industry going?\"",
  "Final \"anything else you'd like us to know?\"",
];

export const HORIZON_BRIDGE = `Today (BPDA)          →    Migration era           →    Connected service era
GP + SQL + BPA             D365 + data cleanup          IoT + AI + CRM loop
Process + data quality     Workflow re-design           Predictive ops + recurring revenue`;

export const PROACTIVE_REVENUE_EXAMPLE =
  "Flory identifies a $4,500 repair likely within 45 days before the customer feels the failure. Proactive outreach: \"We recommend service during your scheduled maintenance window next month.\" Equipment data becomes a customer-facing revenue engine.";
