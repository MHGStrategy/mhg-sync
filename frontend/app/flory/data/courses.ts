export type CourseKind = "path" | "module" | "docs" | "practice";

export type CourseItem = {
  id: string;
  n: number;
  title: string;
  time?: string;
  priority: "essential" | "high";
  kind: CourseKind;
  learn: string;
  url?: string;
  /** Checklist id of parent learning path (for short modules nested in a path). */
  parentPathId?: string;
};

export const MS_COURSES_STORAGE_KEY = "flory-ms-courses-v2";

export const SCM_TRAINING_HUB_URL =
  "https://learn.microsoft.com/en-us/training/dynamics365/scm";

const LEARN = "https://learn.microsoft.com/en-us/training";

export const MS_COURSES: CourseItem[] = [
  {
    id: "ms-1",
    n: 1,
    title: "Dynamics GP Resource Directory",
    priority: "essential",
    kind: "docs",
    learn:
      "GP terminology and architecture for interview vocabulary; Flory runs GP today on SQL Server",
    url: "https://learn.microsoft.com/en-us/dynamics-gp/resources",
  },
  {
    id: "ms-2",
    n: 2,
    title: "Introduction to Supply Chain Management in Dynamics 365",
    time: "~13h 43m",
    priority: "essential",
    kind: "path",
    learn: "D365 SCM overview: inventory, procurement, warehouse, manufacturing, MRP vocabulary",
    url: `${LEARN}/paths/introduction-supply-chain-management-dynamics-365/`,
  },
  {
    id: "ms-3",
    n: 3,
    title: "Get started with Dynamics 365 Supply Chain Management",
    time: "~1h 49m",
    priority: "essential",
    kind: "module",
    learn: "Quick orientation to how major SCM modules fit together; also in path #4",
    url: `${LEARN}/modules/get-started-supply-chain-management-dyn365-supply-chain-mgmt/`,
    parentPathId: "ms-4",
  },
  {
    id: "ms-4",
    n: 4,
    title: "Configure and manage products and inventory in Dynamics 365 Supply Chain Management",
    time: "~11h 1m",
    priority: "essential",
    kind: "path",
    learn: "Items, products, BOMs, inventory control, and inventory reports",
    url: `${LEARN}/paths/configure-manage-products-inventory-dyn365-supply-chain-mgmt/`,
  },
  {
    id: "ms-5",
    n: 5,
    title: "Get started with inventory management in Dynamics 365 Supply Chain Management",
    time: "~2h 2m",
    priority: "essential",
    kind: "module",
    learn: "Inventory dimensions, sites, warehouses, serial/batch numbers; also in path #4",
    url: `${LEARN}/modules/get-started-inventory-management-supply-chain/`,
    parentPathId: "ms-4",
  },
  {
    id: "ms-6",
    n: 6,
    title: "Configure and use discrete manufacturing in Dynamics 365 Supply Chain Management",
    priority: "essential",
    kind: "path",
    learn: "Production orders, routes, scheduling, shop floor execution in D365",
    url: `${LEARN}/paths/configure-use-discrete-manufacturing-dyn365-supply-chain-mgmt/`,
  },
  {
    id: "ms-7",
    n: 7,
    title: "Get started with discrete manufacturing in Dynamics 365 Supply Chain Management",
    priority: "essential",
    kind: "module",
    learn: "BOMs, production order lifecycle, routes, and operations; also in path #6",
    url: `${LEARN}/modules/get-started-discrete-manufacturing-dyn365-supply-chain-mgmt/`,
    parentPathId: "ms-6",
  },
  {
    id: "ms-8",
    n: 8,
    title: "Master planning in Dynamics 365 Supply Chain Management",
    time: "~7h 20m",
    priority: "essential",
    kind: "path",
    learn: "MRP, demand and supply balancing, planned orders, firming",
    url: `${LEARN}/paths/master-planning-supply-chain-management/`,
  },
  {
    id: "ms-9",
    n: 9,
    title: "Configure and manage procurement and vendors in Dynamics 365 Supply Chain Management",
    priority: "high",
    kind: "path",
    learn: "Procure-to-purchase, POs, vendor collaboration, quality control on inbound materials",
    url: `${LEARN}/paths/configure-manage-procurement-vendors-dyn365-supply-chain-mgmt/`,
  },
  {
    id: "ms-10",
    n: 10,
    title: "Configure and work with warehouse management in Dynamics 365 Supply Chain Management",
    time: "~6h 46m",
    priority: "high",
    kind: "path",
    learn: "Receiving, put-away, picking, cycle counting, warehouse mobile devices",
    url: `${LEARN}/paths/configure-work-warehouse-management-dyn365-supply-chain-mgmt/`,
  },
  {
    id: "ms-11",
    n: 11,
    title: "Automate a business process using Power Automate",
    time: "~4h 37m",
    priority: "high",
    kind: "path",
    learn: "Cloud flows, approvals, multi-source automation, and process advisor for BPA",
    url: `${LEARN}/paths/automate-process-power-automate/`,
  },
  {
    id: "ms-12",
    n: 12,
    title: "Get started building with Power BI",
    time: "~21m",
    priority: "high",
    kind: "module",
    learn: "Dashboards and interactive reports on ERP-shaped data",
    url: `${LEARN}/modules/get-started-with-power-bi/`,
  },
  {
    id: "ms-13",
    n: 13,
    title: "SQL + Python practice on ERP-shaped data",
    priority: "high",
    kind: "practice",
    learn: "Apply existing data skills using the Nut Harvester model on the Apply It tab",
  },
];

export type Phase = { title: string; body: string; diagram?: string };

export const PHASES: Phase[] = [
  {
    title: "Phase 1: GP and current ERP",
    body: "Financials, Inventory, Purchasing, Sales, Manufacturing, SQL Server, Reporting. Flory runs GP today. Goal: discuss it intelligently in interview and support users, not master every screen.",
  },
  {
    title: "Phase 2: Understand the ERP flow",
    body: "Supplier to Purchasing to Receiving to Inventory to Manufacturing to Finished Goods to Customer. D365 SCM is the migration target; learn the same flow in modern vocabulary.",
    diagram:
      "Supplier → Purchasing → Receiving → Inventory → Manufacturing → Finished Goods → Customer",
  },
  {
    title: "Phase 3: Inventory",
    body: "Focus on dimensions, sites, warehouses, locations, item groups, policies, serial/batch numbers, and transactions. When someone says 40 pumps in the system but 27 on the shop floor, this is where you investigate.",
  },
  {
    title: "Phase 4: Manufacturing",
    body: "Discrete manufacturing lifecycle: demand → production requirement → BOM → materials → inventory check → purchase/manufacture → production order → shop floor → finished goods.",
    diagram:
      "Customer demand → Production requirement → BOM → Materials → Inventory check → PO / manufacture → Production order → Shop floor → Finished product → FG inventory",
  },
  {
    title: "Phase 5: MRP / Master Planning",
    body: "Given what we need to produce and what we already have, what materials do we purchase or manufacture? You do not need to become an MRP specialist; you need to answer that business question.",
  },
  {
    title: "Phase 6: Procurement and vendors",
    body: "Purchase requisitions, POs, vendor collaboration, and quality on inbound materials. Maps to GP Purchasing and Flory BPA targets like replenishment and parts availability.",
  },
  {
    title: "Phase 7: Warehouse",
    body: "Layout, locations, receiving, put-away, picking, transfers, cycle counting. Trace: inventory correct in ERP but warehouse cannot find it → physical process → ERP transaction → data.",
  },
  {
    title: "Phase 8: Automation",
    body: "Inventory below minimum → Power Automate → alert buyer → create task → update report. Process advisor maps current-state workflow before you automate. Directly aligned with Technical Support & Automation (~30% of the job).",
  },
  {
    title: "Phase 9: Reporting and SQL practice",
    body: "Power BI on ERP scenarios: on-hand, low stock, open POs, production delays. Then query manufacturing schemas with SQL and Python using the Apply It tab Nut Harvester model.",
  },
];

export const LEARNING_STACK = `                    FLORY
                      │
              ┌───────┴───────┐
              │               │
          DYNAMICS GP     DYNAMICS 365
              │               │
              │         Supply Chain
              │               │
              └───────┬───────┘
                      │
               Manufacturing
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
   Inventory      Procurement     Warehouse
       │              │              │
       └──────────────┼──────────────┘
                      ▼
                    MRP
                      ▼
                 Production
                      │
                      ▼
                    SQL
                      │
              ┌───────┴───────┐
              ▼               ▼
          Power BI       Power Automate
              │               │
              └───────┬───────┘
                      ▼
             PROCESS IMPROVEMENT`;

export const COURSES_FRAMING =
  "Study to answer: How does Flory's process work? Where is data created? Where is it stored? Why might it be wrong? How do I query it, report on it, automate it, and improve the workflow? Not to become a Dynamics consultant.";

export const MS_COURSE_IDS = MS_COURSES.map((c) => c.id);

export const KIND_LABEL: Record<CourseKind, string> = {
  path: "Learning Path",
  module: "Module",
  docs: "Docs",
  practice: "Local practice",
};

export const LINK_LABEL: Record<CourseKind, string | null> = {
  path: "Open on Learn",
  module: "Open on Learn",
  docs: "Open docs",
  practice: null,
};
