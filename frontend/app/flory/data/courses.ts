export type CourseItem = {
  id: string;
  n: number;
  title: string;
  time?: string;
  priority: "essential" | "high";
  learn: string;
  url?: string;
};

export const MS_COURSES: CourseItem[] = [
  {
    id: "ms-1",
    n: 1,
    title: "Introduction to Supply Chain Management in Dynamics 365",
    time: "~13h 43m",
    priority: "essential",
    learn: "Overall ERP/SCM architecture and vocabulary",
    url: "https://learn.microsoft.com/en-us/training/paths/describe-dynamics-365-supply-chain-management/",
  },
  {
    id: "ms-2",
    n: 2,
    title: "Get started with Dynamics 365 Supply Chain Management",
    time: "~1h",
    priority: "essential",
    learn: "How major SCM modules fit together",
  },
  {
    id: "ms-3",
    n: 3,
    title: "Configure and manage products and inventory",
    priority: "essential",
    learn: "Items, products, BOMs, inventory",
  },
  {
    id: "ms-4",
    n: 4,
    title: "Get started with inventory management",
    priority: "essential",
    learn: "Inventory dimensions, warehouses, serial/batch numbers",
  },
  {
    id: "ms-5",
    n: 5,
    title: "Get started with discrete manufacturing",
    priority: "essential",
    learn: "BOMs, production orders, routes, operations",
  },
  {
    id: "ms-6",
    n: 6,
    title: "Configure and use discrete manufacturing",
    priority: "essential",
    learn: "Actual manufacturing workflow in D365",
  },
  {
    id: "ms-7",
    n: 7,
    title: "Master planning in Dynamics 365 SCM",
    time: "~7h 20m",
    priority: "essential",
    learn: "MRP, demand, supply, planned orders",
  },
  {
    id: "ms-8",
    n: 8,
    title: "Configure and work with warehouse management",
    time: "~6h 46m",
    priority: "high",
    learn: "Receiving, picking, inventory movement",
  },
  {
    id: "ms-9",
    n: 9,
    title: "Automate a business process using Power Automate",
    time: "~4h 37m",
    priority: "high",
    learn: "Trigger, condition, action, notification, data update",
    url: "https://learn.microsoft.com/en-us/training/paths/power-automate/",
  },
  {
    id: "ms-10",
    n: 10,
    title: "Get started building with Power BI",
    priority: "high",
    learn: "Dashboards and reporting on ERP data",
    url: "https://learn.microsoft.com/en-us/training/paths/power-bi/",
  },
  {
    id: "ms-11",
    n: 11,
    title: "Dynamics GP Resource Directory",
    priority: "high",
    learn: "GP terminology and architecture (interview vocabulary, not 20h on old UI)",
    url: "https://learn.microsoft.com/en-us/dynamics-gp/",
  },
  {
    id: "ms-12",
    n: 12,
    title: "SQL + Python practice on ERP-shaped data",
    priority: "high",
    learn: "Apply existing data skills to manufacturing schemas",
  },
];

export type Phase = { title: string; body: string; diagram?: string };

export const PHASES: Phase[] = [
  {
    title: "Phase 1: Understand the ERP",
    body: "Supplier to Purchasing to Receiving to Inventory to Manufacturing to Finished Goods to Customer. That is the fundamental flow.",
    diagram:
      "Supplier → Purchasing → Receiving → Inventory → Manufacturing → Finished Goods → Customer",
  },
  {
    title: "Phase 2: Inventory",
    body: "Focus on dimensions, sites, warehouses, locations, item groups, policies, serial/batch numbers, and transactions. When someone says 40 pumps in the system but 27 on the shop floor, this is where you investigate.",
  },
  {
    title: "Phase 3: Manufacturing",
    body: "Discrete manufacturing lifecycle: demand → production requirement → BOM → materials → inventory check → purchase/manufacture → production order → shop floor → finished goods.",
    diagram:
      "Customer demand → Production requirement → BOM → Materials → Inventory check → PO / manufacture → Production order → Shop floor → Finished product → FG inventory",
  },
  {
    title: "Phase 4: MRP / Master Planning",
    body: "Given what we need to produce and what we already have, what materials do we purchase or manufacture? You do not need to become an MRP specialist; you need to answer that business question.",
  },
  {
    title: "Phase 5: Warehouse",
    body: "Layout, locations, receiving, put-away, picking, transfers, cycle counting. Trace: inventory correct in ERP but warehouse cannot find it → physical process → ERP transaction → data.",
  },
  {
    title: "Phase 6: Automation",
    body: "Inventory below minimum → Power Automate → alert buyer → create task → update report. Directly aligned with Technical Support & Automation (~30% of the job).",
  },
  {
    title: "Phase 7: Power BI",
    body: "Apply to ERP scenarios: inventory (on-hand, low stock, stockouts), purchasing (open/late POs, vendor performance), production (open/complete orders, delays), materials shortages, operations throughput.",
  },
  {
    title: "Phase 8: GP terminology",
    body: "Financials, Inventory, Purchasing, Sales, Manufacturing, SQL Server, Reporting. Goal: discuss GP intelligently in interview, not master every screen.",
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
