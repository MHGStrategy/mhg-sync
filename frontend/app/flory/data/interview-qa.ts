export type InterviewQA = {
  id: string;
  question: string;
  answer: string;
  proof?: string;
};

export const INTERVIEW_QA: InterviewQA[] = [
  {
    id: "iq-1",
    question: "Tell me about yourself.",
    answer:
      "I work at the intersection of operations and systems. At MHG Strategy I have spent five years leading analytics and operational initiatives: building reporting pipelines, reconciling operational data, and translating what stakeholders need into specs teams can execute. Before that I ran commercial and program work at IrisVision, including a cross-functional product build that supported a $33.5M funding milestone. I am based in Salida, across the 99 from Flory, and I can start immediately.",
    proof: "MHG freelance lead + IrisVision program manager story.",
  },
  {
    id: "iq-2",
    question: "Why Flory? Why this role?",
    answer:
      "Flory manufactures physical equipment with real inventory, production, and dealer delivery constraints. That is the same problem class I have solved in logistics, restaurants, and medical devices: find where the data breaks, fix the process, build the report or automation that keeps it fixed. This seat sits between operations and IT. That is where I have always worked.",
  },
  {
    id: "iq-3",
    question: "Walk me through a process improvement you led.",
    answer:
      "At Madden Restaurant Group leadership assumed theft was driving cost-of-sales variance. I reconciled warehouse and POS data by category and ordering cycle. The data showed expired inventory, not theft. We implemented a unified inventory system tied to sales data. Waste dropped 70%. I did not accept the narrative until the reconciliation matched.",
    proof: "Madden story card; variance by category.",
  },
  {
    id: "iq-4",
    question: "Tell me about a data quality or inventory discrepancy.",
    answer:
      "Same Madden engagement: two systems disagreed and the business had a wrong root cause. I traced transactions to the grain where the error entered, proved the hypothesis with data, and fixed the process. At Flory I would use the same sequence: where is the transaction created, who owns it, what breaks downstream.",
    proof: "See Apply It tab: Nut Harvester investigation map.",
  },
  {
    id: "iq-5",
    question: "Describe a cross-functional project.",
    answer:
      "At IrisVision I led the remote diagnostic solution. I mapped physician pain points, built a model on reducing appointment dependency, and coordinated executives, legal, tech, physicians, sales, and marketing to keep the build on scope. I personally beta tested before we called it complete. That work supported a $33.5M funding milestone.",
    proof: "IrisVision Sr. Program Manager; beta test gate.",
  },
  {
    id: "iq-6",
    question: "What is your Dynamics GP experience?",
    answer:
      "I have not administered GP in production yet. I query SQL against ERP backends, built ETL and reconciliation during a live Salesforce migration, and understand inventory, BOM, MRP, and manufacturing transaction concepts from study and prior ERP-shaped work. My ramp plan starts with GP inventory and manufacturing modules because that is where this job lives.",
  },
  {
    id: "iq-7",
    question: "Six Sigma or Lean background?",
    answer:
      "Six Sigma and Theory of Constraints were covered extensively in my MBA coursework. I do not hold a belt certification. I have delivered continuous improvement outcomes: 70% waste reduction, 67% revenue lift from a driver-based operational change. I will deepen plant Lean language on site.",
  },
  {
    id: "iq-8",
    question: "How do you use SQL and Power BI?",
    answer:
      "At Pyramid Logistics I built an automated ETL reporting system during a live migration: four-dimensional model, transformation logic for source inconsistencies, and a GL reconciliation cell that blocked any report with nonzero variance. Power BI and SQL are how I turn ERP data into decisions leadership can act on.",
    proof: "Pyramid ETL + GL gate.",
  },
  {
    id: "iq-9",
    question: "Where is data created, and why might it be wrong?",
    answer:
      "Every ERP number starts at a transaction: receipt, issue, production entry, adjustment. Wrong data usually means wrong timing, wrong quantity, wrong location, wrong BOM, or a manual workaround outside the system. I document the as-is path before blaming people.",
  },
  {
    id: "iq-10",
    question: "How would you approach a new business process analysis effort?",
    answer:
      "Charter the team, elicit and model as-is, document goals, run GQM, apply the CCC test, find root cause, validate with stakeholders, then model to-be and hand recommendations to management. Analysis and implementation stay separate projects.",
    proof: "BPA Guide lifecycle.",
  },
  {
    id: "iq-11",
    question: "Walk me through investigating an inventory discrepancy.",
    answer:
      "Start with the business question: how many should we have, where, and for which item? Compare ERP on-hand to physical count. Trace back through receipts, issues, production consumption, and adjustments. Check BOM and pick list accuracy, reorder point, MRP output, and whether someone failed to post a transaction. The Apply It tab maps each question to the ERP concept.",
  },
  {
    id: "iq-12",
    question: "What skills would you want to develop in this role?",
    answer:
      "Deep GP inventory and manufacturing module fluency, Power Automate for operational alerts, and plant-floor Lean vocabulary in Flory's context. I bring SQL, Python, Power BI, reconciliation discipline, and BPA method now; I want to attach those to Flory's system of record and production rhythms.",
  },
  {
    id: "iq-13",
    question: "What three words would your current manager use to describe you?",
    answer: "Precise. Direct. Accountable.",
  },
  {
    id: "iq-14",
    question: "How would AI affect Flory?",
    answer:
      "Not as a technology project. Flory has an opportunity to move client-facing service from break-fix to continuous monitor, predict, and optimize: IoT on equipment, alerts into CRM and work orders, technician briefings before arrival, grower visibility in a portal. That creates recurring revenue and ties to the same data quality and process work this seat owns today. See Conversation tab for the full evolution.",
  },
  {
    id: "iq-15",
    question: "Where do you see this role in three years?",
    answer:
      "Year one: own data quality, BPA, and reporting on GP. Migration era: map as-is workflows and parallel reporting as Flory moves toward D365. Connected service era: sit on the loop from machine telemetry to service to customer. The seat grows with the platform, not around it.",
  },
  {
    id: "iq-16",
    question: "When can you start? Where are you located?",
    answer:
      "I can start immediately. I live in Salida, right across the 99 from Flory. No relocation.",
  },
  {
    id: "iq-17",
    question: "What is your biggest gap for this role?",
    answer:
      "Production GP administration depth. I have a clear ramp plan, SQL access pattern, and ERP transaction mental model. I learn systems by documenting as-is reality and fixing what breaks, not by reading manuals in isolation.",
  },
  {
    id: "iq-18",
    question: "Tell me about a gap in your employment.",
    answer:
      "I am well, I am here, and I am not hedging. [Use one plain paragraph with facts only if asked; do not reappear elsewhere in the interview.]",
  },
];
