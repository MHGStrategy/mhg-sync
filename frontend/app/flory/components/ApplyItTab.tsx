"use client";

import {
  BOM_TREE_LINES,
  DATA_MODEL_TABLE,
  LEAN_SCENARIO,
  NUT_HARVESTER_NOTE,
  PORTFOLIO_PROJECTS,
  PROJECT_CHECKLIST_IDS,
  PROJECT_CHECKLIST_ITEMS,
  SKILL_PROOFS,
  STACK_DIAGRAM_LINES,
} from "../data/apply-it";
import { usePersistedChecks } from "../hooks/usePersistedChecks";
import { ChecklistItem, ProgressBar } from "./ChecklistItem";
import { Callout, SectionCard } from "./SectionCard";

export function ApplyItTab() {
  const { checked, toggle, doneCount, total } = usePersistedChecks(
    "flory-apply-it-projects",
    PROJECT_CHECKLIST_IDS
  );

  return (
    <div className="space-y-4">
      <Callout tone="warn">{NUT_HARVESTER_NOTE}</Callout>

      <SectionCard title="Fictional product: Flory Nut Harvester">
        <pre className="text-xs text-[#00e5ff] overflow-x-auto whitespace-pre font-mono">
          {BOM_TREE_LINES.join("\n")}
        </pre>
      </SectionCard>

      <SectionCard title="Where does each piece of information live?">
        <p className="text-sm text-[#6b8fa8] mb-3">
          The job description as a data model. When Flory says inventory is wrong, this is the investigation map.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#6b8fa8] text-left border-b border-[#1e3a50]">
                <th className="py-2 pr-4">Business question</th>
                <th className="py-2">ERP / data concept</th>
              </tr>
            </thead>
            <tbody>
              {DATA_MODEL_TABLE.map((row) => (
                <tr key={row.question} className="border-b border-[#1e3a50]/40">
                  <td className="py-2 pr-4 text-[#e0f4ff]">{row.question}</td>
                  <td className="py-2 text-[#00e5ff]">{row.concept}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Skills mental architecture">
        <pre className="text-xs text-[#6b8fa8] overflow-x-auto whitespace-pre mb-4">
          {STACK_DIAGRAM_LINES.join("\n")}
        </pre>
        <div className="space-y-2">
          {SKILL_PROOFS.map((s) => (
            <div key={s.layer} className="text-sm">
              <span className="text-[#00e5ff] font-medium">{s.layer}:</span>{" "}
              <span className="text-[#e0f4ff]">{s.proof}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Three portfolio project specs">
        <ProgressBar done={doneCount} total={total} />
        {PROJECT_CHECKLIST_ITEMS.map((item) => (
          <ChecklistItem
            key={item.id}
            id={item.id}
            label={item.label}
            checked={!!checked[item.id]}
            onToggle={toggle}
          />
        ))}
        {PORTFOLIO_PROJECTS.map((p) => (
          <div key={p.id} className="mt-6 pt-4 border-t border-[#1e3a50]">
            <h4 className="text-[#00e5ff] font-medium mb-1">
              {p.title}{" "}
              <span className="text-[#6b8fa8] font-normal text-xs">({p.jobPct})</span>
            </h4>
            {p.schema && (
              <>
                <p className="text-xs text-[#6b8fa8] mt-2">Schema outline:</p>
                <p className="text-sm text-[#e0f4ff]">{p.schema.join(" · ")}</p>
              </>
            )}
            {p.questions && (
              <ul className="mt-2 space-y-1">
                {p.questions.map((q) => (
                  <li key={q} className="text-sm text-[#e0f4ff]">
                    · {q}
                  </li>
                ))}
              </ul>
            )}
            {p.dashboard && (
              <div className="mt-2 space-y-2">
                {p.dashboard.map((d) => (
                  <div key={d.area} className="text-sm">
                    <span className="text-[#00e5ff]">{d.area}:</span>{" "}
                    <span className="text-[#e0f4ff]">{d.metrics}</span>
                  </div>
                ))}
              </div>
            )}
            {p.flow && (
              <pre className="text-xs text-[#6b8fa8] mt-2 whitespace-pre-wrap">
                {p.flow.join("\n       ↓\n")}
              </pre>
            )}
            <p className="text-xs text-[#00e5ff] mt-2">Parallel: {p.parallel}</p>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Lean applied: production stops for missing components">
        <p className="text-sm text-[#e0f4ff] mb-3">
          <span className="text-[#00e5ff]">Problem:</span> {LEAN_SCENARIO.problem}
        </p>
        <ul className="space-y-2">
          {LEAN_SCENARIO.questions.map((q) => (
            <li key={q} className="text-sm text-[#e0f4ff] flex gap-2">
              <span className="text-[#6b8fa8]">?</span>
              {q}
            </li>
          ))}
        </ul>
        <p className="text-xs text-[#6b8fa8] mt-4">{LEAN_SCENARIO.tieIn}</p>
      </SectionCard>
    </div>
  );
}
