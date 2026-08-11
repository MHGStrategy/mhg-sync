export type DataModelRow = { question: string; concept: string };

export const DATA_MODEL_TABLE: DataModelRow[] = [
  { question: "How many harvesters are we building?", concept: "Production orders" },
  { question: "What parts do we need?", concept: "BOM" },
  { question: "Do we have enough parts?", concept: "Inventory" },
  { question: "Where are the parts?", concept: "Warehouse / location" },
  { question: "What do we need to buy?", concept: "MRP / master planning" },
  { question: "Who supplies them?", concept: "Vendor master" },
  { question: "What did we actually receive?", concept: "PO receipt" },
  { question: "What was consumed in production?", concept: "Inventory / production transactions" },
  { question: "How much did it cost?", concept: "Manufacturing / financial data" },
  { question: "Why is inventory wrong?", concept: "Transaction / data-quality investigation" },
];

export type SkillProof = { layer: string; proof: string };

export const SKILL_PROOFS: SkillProof[] = [
  { layer: "ERP / GP", proof: "Pyramid ETL during live migration; SAP as extraction source" },
  { layer: "SQL / Database", proof: "Direct query pattern; GL reconciliation gate" },
  { layer: "Power BI", proof: "Operational and executive dashboards; KPI architecture" },
  { layer: "Excel", proof: "Power Query, pivot validation before SQL" },
  { layer: "Python", proof: "pandas ETL, data maintenance scripts" },
  { layer: "Process Improvement", proof: "Madden 70% waste; Philly's 67% revenue lift" },
  { layer: "Power Automate", proof: "On ramp; automation flow in Project #3 spec" },
];

export type PortfolioProject = {
  id: string;
  title: string;
  jobPct: string;
  schema?: string[];
  questions?: string[];
  dashboard?: { area: string; metrics: string }[];
  flow?: string[];
  parallel: string;
};

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "proj-1",
    title: "ERP data analysis",
    jobPct: "Data / Reporting ~30%",
    schema: [
      "Items",
      "Inventory",
      "Vendors",
      "Purchase Orders",
      "Production Orders",
      "BOMs",
      "Sales Orders",
    ],
    questions: [
      "Which components are below reorder level?",
      "Which purchase orders are late?",
      "Which products consume the most materials?",
      "Which inventory items have unusual adjustments?",
      "Which production orders are delayed?",
    ],
    parallel: "Madden variance by category; Pyramid GL reconciliation.",
  },
  {
    id: "proj-2",
    title: "Manufacturing dashboard",
    jobPct: "Reporting",
    dashboard: [
      { area: "Inventory", metrics: "On-hand value, stockouts, low-stock, by location" },
      { area: "Production", metrics: "Open orders, completed, delays, material shortages" },
      { area: "Purchasing", metrics: "Open POs, late POs, vendor performance" },
    ],
    parallel: "Operational vs executive dashboard altitude from resume.",
  },
  {
    id: "proj-3",
    title: "Automation",
    jobPct: "Technical Support & Automation ~30%",
    flow: [
      "Inventory below threshold",
      "Detect condition",
      "Create alert",
      "Notify purchasing",
      "Create report",
    ],
    parallel: "ETL pipeline automation; internal tool enhancements.",
  },
];

export const PROJECT_CHECKLIST_ITEMS = [
  { id: "ap-read-1", label: "Project #1 spec read (ERP SQL analysis)" },
  { id: "ap-read-2", label: "Project #2 spec read (Power BI dashboard)" },
  { id: "ap-read-3", label: "Project #3 spec read (automation flow)" },
  { id: "ap-draft-1", label: "Project #1: fake schema drafted in SQL" },
  { id: "ap-draft-2", label: "Project #2: dashboard mock started" },
  { id: "ap-draft-3", label: "Project #3: automation flow documented" },
];

export const PROJECT_CHECKLIST_IDS = PROJECT_CHECKLIST_ITEMS.map((i) => i.id);

export const LEAN_SCENARIO = {
  problem:
    "Production frequently stops because components are not available.",
  questions: [
    "Where does the process break?",
    "What is the root cause?",
    "Is the ERP data wrong?",
    "Is purchasing late?",
    "Is inventory inaccurate?",
    "Is the BOM incorrect?",
    "Is the reorder point wrong?",
    "Is MRP generating wrong recommendations?",
    "Is someone failing to enter a transaction?",
  ],
  tieIn: "BPA Guide detective mode + CCC test. Name the waste (waiting) before proposing the fix.",
};

export const NUT_HARVESTER_NOTE =
  "Fictional study model for interview prep. Not claimed Flory product or BOM knowledge.";

export const BOM_TREE_LINES = [
  "Flory Nut Harvester (finished product)",
  "        │",
  "       BOM",
  " ┌──────┼────────┐",
  " │      │        │",
  "Engine Frame   Hydraulic System",
  " │      │        ├── Pump",
  " │      │        ├── Hoses",
  " │      │        └── Valves",
  " │      └── Steel",
  " └── Engine components",
];

export const STACK_DIAGRAM_LINES = [
  "                 FLORY OPERATIONS",
  "                       │",
  "        ┌──────────────┼──────────────┐",
  "        ▼              ▼              ▼",
  "   Purchasing      Manufacturing    Warehouse",
  "        │              │              │",
  "        └──────────────┼──────────────┘",
  "                       ▼",
  "                    ERP / GP",
  "                       │",
  "                 SQL / Database",
  "                       │",
  "          ┌────────────┼────────────┐",
  "          ▼            ▼            ▼",
  "       Power BI      Excel       Python",
  "          │            │            │",
  "          └────────────┼────────────┘",
  "                       ▼",
  "                Process Improvement",
  "                       │",
  "                 Power Automate",
];
