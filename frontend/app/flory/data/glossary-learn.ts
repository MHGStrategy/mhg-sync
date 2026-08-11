export type LearnGlossaryEntry = {
  term: string;
  cat: string;
  def: string;
  say: string;
};

/** Microsoft Learn D365/GP + Power Platform vocabulary (paths 1–12) */
export const D365_GLOSSARY: LearnGlossaryEntry[] = [
  {
    term: "Dynamics 365 Supply Chain Management (SCM)",
    cat: "Learn · D365 / GP",
    def: "Microsoft cloud ERP module set for manufacturing, inventory, warehouse, procurement, and master planning.",
    say: "D365 SCM is where Flory likely lands after GP; same business problems, different module names.",
  },
  {
    term: "Finance & Operations (F&O)",
    cat: "Learn · D365 / GP",
    def: "Former name for the D365 apps that include SCM and Finance; still used in older docs and migration talk.",
    say: "When someone says F&O, they mean the D365 ERP stack, not GP.",
  },
  {
    term: "Procurement (D365 module)",
    cat: "Learn · D365 / GP",
    def: "D365 module for purchase requisitions, POs, vendor collaboration, and inbound supply.",
    say: "Late POs in procurement break MRP and the shop floor.",
  },
  {
    term: "Sales order processing (D365)",
    cat: "Learn · D365 / GP",
    def: "Module that manages customer orders from quote through fulfillment; drives demand for planning.",
    say: "Demand enters here; MRP reads it downstream.",
  },
  {
    term: "Inventory dimensions",
    cat: "Learn · D365 / GP",
    def: "D365 attributes (site, warehouse, location, batch, serial) defining where and how stock is tracked.",
    say: "Wrong dimensions mean the system thinks stock is somewhere it is not.",
  },
  {
    term: "Item groups (D365)",
    cat: "Learn · D365 / GP",
    def: "Product classification in D365 that drives posting, tracking, and planning defaults for similar items.",
    say: "Item group defaults affect every transaction for that part family.",
  },
  {
    term: "Inventory policies (D365)",
    cat: "Learn · D365 / GP",
    def: "Rules for reservation, picking, and negative inventory by item or group.",
    say: "Policy gaps show up as oversells or phantom availability.",
  },
  {
    term: "Batch / serial tracking",
    cat: "Learn · D365 / GP",
    def: "Traceability at lot (batch) or unit (serial) level for compliance, warranty, and recalls.",
    say: "Flory warranty traceability lives here.",
  },
  {
    term: "Production order statuses (D365)",
    cat: "Learn · D365 / GP",
    def: "Lifecycle: Created, Estimated, Scheduled, Released, Started, Reported as finished, Ended.",
    say: "Stuck in Released means materials or capacity blocked release to the floor.",
  },
  {
    term: "Routes and operations",
    cat: "Learn · D365 / GP",
    def: "Manufacturing sequence: which steps, machines, and times build the product.",
    say: "Route accuracy drives capacity planning and cost.",
  },
  {
    term: "Resources (D365 manufacturing)",
    cat: "Learn · D365 / GP",
    def: "Machines, tools, or labor groups scheduled on operations.",
    say: "Constraint is often a resource, not a part.",
  },
  {
    term: "Report as finished (RAF)",
    cat: "Learn · D365 / GP",
    def: "Transaction that posts completed quantity from production into finished-goods inventory.",
    say: "Missing RAF means WIP that never becomes FG in the system.",
  },
  {
    term: "Discrete vs process manufacturing",
    cat: "Learn · D365 / GP",
    def: "Discrete: countable units (harvesters). Process: formulas and batches (chemicals, food).",
    say: "Flory is discrete; BOM and production orders are the model.",
  },
  {
    term: "Master planning run",
    cat: "Learn · D365 / GP",
    def: "Batch calculation that explodes demand, checks supply, and generates planned orders.",
    say: "Bad master data in means bad planned orders out.",
  },
  {
    term: "Planned orders",
    cat: "Learn · D365 / GP",
    def: "System-suggested purchase, transfer, or production orders from MRP not yet firmed.",
    say: "Planned orders are recommendations until a buyer or planner converts them.",
  },
  {
    term: "Action messages",
    cat: "Learn · D365 / GP",
    def: "MRP outputs: postpone, advance, increase, decrease, or create orders to balance supply and demand.",
    say: "Action messages are the planner's to-do list from the system.",
  },
  {
    term: "Coverage settings",
    cat: "Learn · D365 / GP",
    def: "Rules per item for how far ahead to plan and which supply sources to use.",
    say: "Wrong coverage produces spurious purchase suggestions.",
  },
  {
    term: "Demand forecasting (D365)",
    cat: "Learn · D365 / GP",
    def: "Statistical or adjusted forecast of future demand fed into master planning.",
    say: "Ag seasonal demand makes forecast quality critical for Flory.",
  },
  {
    term: "Planning optimization",
    cat: "Learn · D365 / GP",
    def: "D365 engine that runs large master planning scenarios in parallel for performance.",
    say: "Know it exists; the business question is still what to buy and when.",
  },
  {
    term: "Warehouse management (WMS)",
    cat: "Learn · D365 / GP",
    def: "Advanced D365 module for directed put-away, picking, and mobile warehouse workflows.",
    say: "ERP says 40 on hand; WMS tells you which aisle.",
  },
  {
    term: "Inbound / outbound operations",
    cat: "Learn · D365 / GP",
    def: "Receiving and shipping workflows with location-level tracking in WMS.",
    say: "Receiving errors are a common inventory accuracy break point.",
  },
  {
    term: "Transfer orders",
    cat: "Learn · D365 / GP",
    def: "Move inventory between sites or warehouses with in-transit tracking.",
    say: "In-transit not posted looks like missing stock.",
  },
  {
    term: "Power Automate cloud flow",
    cat: "Learn · D365 / GP",
    def: "No-code automation: trigger, conditions, actions across connectors (ERP, email, Teams).",
    say: "Inventory below minimum to alert buyer is a one-flow proof of automation fit.",
  },
  {
    term: "Trigger / Condition / Action",
    cat: "Learn · D365 / GP",
    def: "Flow logic: when event fires, if rules pass, then do steps (notify, update, create record).",
    say: "Every manual if-then email chain is a flow waiting to be built.",
  },
  {
    term: "Connector (Power Platform)",
    cat: "Learn · D365 / GP",
    def: "Prebuilt link from Power Automate or Power Apps to a system (SQL, D365, Outlook).",
    say: "SQL connector plus GP database is how I would start without full D365 API depth.",
  },
  {
    term: "Semantic model (Power BI)",
    cat: "Learn · D365 / GP",
    def: "Layer where tables, relationships, and measures are defined for reports.",
    say: "Get the model right once; every dashboard inherits it.",
  },
  {
    term: "Measure vs calculated column",
    cat: "Learn · D365 / GP",
    def: "Measure: aggregates at query time (SUM, COUNT). Calculated column: row-level value stored in the model.",
    say: "Use measures for KPIs; calculated columns for row labels and buckets.",
  },
  {
    term: "DirectQuery vs Import (Power BI)",
    cat: "Learn · D365 / GP",
    def: "Import: copy data into PBI. DirectQuery: query live SQL on each interaction.",
    say: "GP SQL DirectQuery for ops dashboards; Import for frozen month-end packs.",
  },
  {
    term: "GP to D365 migration",
    cat: "Learn · D365 / GP",
    def: "Moving master data, open transactions, and processes from Dynamics GP to D365 SCM.",
    say: "Map as-is GP before configuring to-be D365; document UDFs and workarounds first.",
  },
  {
    term: "Released product (D365)",
    cat: "Learn · D365 / GP",
    def: "Item master record enabled for a specific legal entity with inventory and production settings.",
    say: "Unreleased product cannot be planned or transacted in that company.",
  },
  {
    term: "Costing version (D365)",
    cat: "Learn · D365 / GP",
    def: "Standard or planned cost structure for materials and routes used in manufacturing cost rolls.",
    say: "Costing errors show up in variance, not just in finance.",
  },
];

/** UNESCO Global MOOC on the Ethics of AI — module vocabulary */
export const ETHICS_GLOSSARY: LearnGlossaryEntry[] = [
  {
    term: "AI ethics",
    cat: "Learn · AI Ethics",
    def: "Field applying moral principles to design, deployment, and use of AI systems across their lifecycle.",
    say: "Ethics is how connected equipment earns trust with growers and dealers.",
  },
  {
    term: "AI lifecycle",
    cat: "Learn · AI Ethics",
    def: "Stages from problem definition and data collection through training, deployment, monitoring, and retirement.",
    say: "Flory telemetry plus AI fails if we only ethics-check at launch.",
  },
  {
    term: "Ethics-by-design",
    cat: "Learn · AI Ethics",
    def: "Embedding ethical constraints into systems from design through deployment, not auditing after launch.",
    say: "Predictive maintenance alerts should be ethical from the sensor up.",
  },
  {
    term: "Human-AI interaction",
    cat: "Learn · AI Ethics",
    def: "How people perceive, trust, and work with AI outputs in real tasks.",
    say: "Technician copilot must preserve judgment on service calls.",
  },
  {
    term: "Human dignity (AI context)",
    cat: "Learn · AI Ethics",
    def: "AI systems must not demean, coerce, or remove meaningful choice from affected people.",
    say: "Growers are not alarm-fatigue targets; they are decision-makers.",
  },
  {
    term: "Stanford AI Ethics Toolkit",
    cat: "Learn · AI Ethics",
    def: "Practical framework referenced in UNESCO MOOC module 2 for ethical AI design decisions.",
    say: "Toolkit language helps structure stakeholder reviews on connected products.",
  },
  {
    term: "AI safety",
    cat: "Learn · AI Ethics",
    def: "Preventing unintended harm from AI behavior in operation, including edge cases and failures.",
    say: "Wrong failure prediction on a harvester is a safety and liability question.",
  },
  {
    term: "Secure AI deployment",
    cat: "Learn · AI Ethics",
    def: "Protecting models, data pipelines, and endpoints from tampering, leakage, and unauthorized access.",
    say: "Field telemetry paths need the same rigor as ERP access control.",
  },
  {
    term: "Algorithmic fairness",
    cat: "Learn · AI Ethics",
    def: "Ensuring AI outcomes do not systematically disadvantage groups without justification.",
    say: "Dealer and regional service policies must not encode unfair bias.",
  },
  {
    term: "Non-discrimination (AI)",
    cat: "Learn · AI Ethics",
    def: "UNESCO principle: AI must not discriminate on protected or irrelevant grounds.",
    say: "Parts allocation and service priority need explicit, auditable rules.",
  },
  {
    term: "Inclusive AI",
    cat: "Learn · AI Ethics",
    def: "Design that works for diverse users, contexts, and accessibility needs.",
    say: "Grower dashboard UX is not one-size-fits-all enterprise IT.",
  },
  {
    term: "Privacy-by-design",
    cat: "Learn · AI Ethics",
    def: "Build privacy controls into systems by default, not as an afterthought.",
    say: "Equipment health data crosses farm, dealer, and Flory; design for that.",
  },
  {
    term: "Personal data (telemetry)",
    cat: "Learn · AI Ethics",
    def: "Information that identifies or relates to identifiable individuals or farm operations.",
    say: "Know what telemetry is personal before it leaves the machine.",
  },
  {
    term: "Transparency (AI)",
    cat: "Learn · AI Ethics",
    def: "Stakeholders can understand that AI is in use and what it is intended to do.",
    say: "Tell the grower when a alert is model-driven, not a mystery fault code.",
  },
  {
    term: "Explainability",
    cat: "Learn · AI Ethics",
    def: "Ability to describe why an AI system produced a specific output in understandable terms.",
    say: "82% bearing failure means nothing without what signal drove it.",
  },
  {
    term: "Accountability (AI)",
    cat: "Learn · AI Ethics",
    def: "Clear ownership when AI-assisted decisions cause harm or error; TEA with transparency and explainability.",
    say: "Someone owns the model threshold when a false alert stops harvest.",
  },
  {
    term: "TEA (Transparency, Explainability, Accountability)",
    cat: "Learn · AI Ethics",
    def: "UNESCO module 6 cluster for trustworthy AI communication and governance.",
    say: "TEA is the language for Flory connected service reviews.",
  },
  {
    term: "AI sustainability",
    cat: "Learn · AI Ethics",
    def: "Environmental cost of AI compute and IoT infrastructure over the system lifecycle.",
    say: "Fewer wasted service trips is ethics and sustainability together.",
  },
  {
    term: "Proportionality principle",
    cat: "Learn · AI Ethics",
    def: "AI intervention scale must match the seriousness of the problem; avoid over-surveillance or over-automation.",
    say: "Not every vibration spike needs a critical alert.",
  },
  {
    term: "Do no harm",
    cat: "Learn · AI Ethics",
    def: "UNESCO core principle: avoid foreseeable damage to people, society, and environment.",
    say: "Alarm fatigue hides real failures; that is harm.",
  },
  {
    term: "Human autonomy",
    cat: "Learn · AI Ethics",
    def: "People retain meaningful choice over decisions that affect them, even when AI recommends.",
    say: "AI recommends service date; grower and tech confirm.",
  },
  {
    term: "Meaningful work (AI economy)",
    cat: "Learn · AI Ethics",
    def: "AI should augment skilled work, not strip judgment and dignity from jobs.",
    say: "Technician copilot augments; it does not replace the relationship Flory sells.",
  },
  {
    term: "AI augmentation vs replacement",
    cat: "Learn · AI Ethics",
    def: "Augmentation assists human decision; replacement removes the human from the loop.",
    say: "Flory field service is augmentation seat, not lights-out service.",
  },
  {
    term: "UNESCO Recommendation on Ethics of AI",
    cat: "Learn · AI Ethics",
    def: "2021 global norm adopted by 193 member states; foundation for the Coursera MOOC.",
    say: "Global standard language for stakeholder conversations on connected products.",
  },
  {
    term: "Global AI governance",
    cat: "Learn · AI Ethics",
    def: "Cross-border rules, norms, and institutions for responsible AI development and use.",
    say: "AgTech data may cross jurisdictions as Flory scales connectivity.",
  },
  {
    term: "Normative framework (AI)",
    cat: "Learn · AI Ethics",
    def: "Shared values and principles that guide policy and engineering choices for AI.",
    say: "Ethics MOOC turns principles into decisions I can use in a BPA charter.",
  },
];
