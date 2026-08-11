export type EthicsModule = {
  id: string;
  n: number;
  title: string;
  floryApp: string;
};

export const ETHICS_MODULES: EthicsModule[] = [
  {
    id: "eth-1",
    n: 1,
    title: "Foundations of AI Ethics",
    floryApp: "Frame connected-equipment initiatives as ethics-by-design, not bolt-on compliance.",
  },
  {
    id: "eth-2",
    n: 2,
    title: "Human-AI Interaction",
    floryApp: "Technician copilot and grower dashboard must preserve human judgment on service decisions.",
  },
  {
    id: "eth-3",
    n: 3,
    title: "Safety and Security",
    floryApp: "Field equipment telemetry and remote diagnostics require secure data paths.",
  },
  {
    id: "eth-4",
    n: 4,
    title: "Fairness, Non-Discrimination, and Inclusion",
    floryApp: "Dealer and grower data policies must not favor regions or customer size unfairly.",
  },
  {
    id: "eth-5",
    n: 5,
    title: "Privacy, Data Protection, and Data Governance",
    floryApp: "Equipment health data crosses farm, dealer, and Flory; governance is a product requirement.",
  },
  {
    id: "eth-6",
    n: 6,
    title: "Transparency, Explainability, and Accountability",
    floryApp: "Predictive maintenance alerts need explainable confidence, not black-box scares.",
  },
  {
    id: "eth-7",
    n: 7,
    title: "AI, Environment, and Sustainability",
    floryApp: "Optimize parts and service trips to reduce waste and unnecessary field miles.",
  },
  {
    id: "eth-8",
    n: 8,
    title: "Proportionality and Do No Harm",
    floryApp: "Automate alerts that help growers; avoid alarm fatigue that hides real failures.",
  },
  {
    id: "eth-9",
    n: 9,
    title: "Human Autonomy, Meaningful Work, and the AI Economy",
    floryApp: "AI augments technicians; it does not replace the relationship Flory sells.",
  },
  {
    id: "eth-10",
    n: 10,
    title: "Global AI Governance",
    floryApp: "AgTech data may cross jurisdictions; align with norms as connected products scale.",
  },
];

export const ETHICS_COURSE_URL =
  "https://www.coursera.org/learn/global-mooc-on-the-ethics-of-ai";

export const ETHICS_MODULE_IDS = ETHICS_MODULES.map((m) => m.id);
