"use client";

import { useState } from "react";
import {
  AI_FAILURE_EXAMPLE,
  CLOSED_LOOP,
  EQUIPMENT_DASHBOARD_ROWS,
  GP365_EVOLUTION,
  GP365_INTERVIEW_LINE,
  GP_LIFECYCLE_MILESTONES,
  GP_MICROSOFT_RECOMMENDED_PATH,
  GP_MICROSOFT_RESOURCES,
  GP_MIGRATION_SCOPE,
  GP_PAGE_SUMMARY,
  GP_STRATEGIC_QUESTION,
  GP_TRANSITION_REALITY,
  GP_VERSION_NOTE,
  GP_WHAT_STOPS_AFTER_2029,
  HORIZON_BRIDGE,
  IOT_FOUNDATION,
  PROACTIVE_REVENUE_EXAMPLE,
  RECURRING_TIERS,
  SERVICE_EVOLUTION_TABLE,
  STRATEGIC_PITCH,
  SUCCESS_TODAY,
  TECHNICIAN_BRIEFING,
  WHEN_TO_USE_PITCH,
} from "../data/conversation";
import { Callout, SectionCard } from "./SectionCard";

const HORIZONS = [
  { id: "h1", title: "Horizon 1: Success today (Year 1)", content: "success" },
  { id: "h2", title: "Horizon 2: GP to Dynamics 365", content: "gp365" },
  { id: "h3", title: "Horizon 3: AI + IoT service evolution", content: "ai" },
] as const;

export function ConversationTab() {
  const [openHorizon, setOpenHorizon] = useState<string>("h1");

  return (
    <div className="space-y-4">
      <SectionCard title="Role evolution timeline">
        <pre className="text-xs text-[#6b8fa8] overflow-x-auto whitespace-pre mb-4">
          {HORIZON_BRIDGE}
        </pre>
        <div className="flex flex-wrap gap-2">
          {HORIZONS.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setOpenHorizon(h.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border ${
                openHorizon === h.id
                  ? "border-[#00e5ff]/50 text-[#00e5ff] bg-[#00e5ff]/10"
                  : "border-[#1e3a50] text-[#6b8fa8]"
              }`}
            >
              {h.title.replace("Horizon ", "H")}
            </button>
          ))}
        </div>
      </SectionCard>

      {openHorizon === "h1" && (
        <SectionCard title="Horizon 1: Success in this role today">
          <ul className="space-y-2">
            {SUCCESS_TODAY.map((b) => (
              <li key={b} className="text-sm text-[#e0f4ff] flex gap-2">
                <span className="text-[#00e5ff]">·</span>
                {b}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {openHorizon === "h2" && (
        <>
          <Callout>{GP_PAGE_SUMMARY}</Callout>

          <SectionCard title="GP lifecycle dates (Microsoft Learn)">
            <div className="space-y-3 mb-4">
              {GP_LIFECYCLE_MILESTONES.map((m) => (
                <div
                  key={m.date}
                  className="border border-[#1e3a50] rounded-lg px-3 py-2 bg-[#050b14]"
                >
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[#00e5ff] text-sm font-medium">{m.date}</span>
                    <span className="text-[#e0f4ff] text-sm">{m.label}</span>
                  </div>
                  <p className="text-xs text-[#6b8fa8] mt-1">{m.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#6b8fa8] mb-2">After December 31, 2029, Microsoft will no longer provide:</p>
            <ul className="space-y-1">
              {GP_WHAT_STOPS_AFTER_2029.map((item) => (
                <li key={item} className="text-sm text-[#e0f4ff]">
                  · {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-[#6b8fa8] mt-3">{GP_VERSION_NOTE}</p>
          </SectionCard>

          <SectionCard title="What the transition actually involves">
            <ul className="space-y-2">
              {GP_TRANSITION_REALITY.map((b) => (
                <li key={b} className="text-sm text-[#e0f4ff] flex gap-2">
                  <span className="text-[#00e5ff]">·</span>
                  {b}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Microsoft's recommended path vs. Flory context">
            <p className="text-sm text-[#e0f4ff] mb-2">
              Microsoft encourages GP customers to move to{" "}
              <strong className="text-[#00e5ff] font-medium">
                {GP_MICROSOFT_RECOMMENDED_PATH.product}
              </strong>
              :
            </p>
            <ul className="space-y-1 mb-3">
              {GP_MICROSOFT_RECOMMENDED_PATH.reasons.map((r) => (
                <li key={r} className="text-sm text-[#e0f4ff]">
                  · {r}
                </li>
              ))}
            </ul>
            <p className="text-sm text-[#6b8fa8]">{GP_MICROSOFT_RECOMMENDED_PATH.caveat}</p>
          </SectionCard>

          <SectionCard title="Migration scope checklist">
            <ul className="space-y-1">
              {GP_MIGRATION_SCOPE.map((item) => (
                <li key={item} className="text-sm text-[#e0f4ff]">
                  · {item}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Your role in the transition">
            <ul className="space-y-2 mb-4">
              {GP365_EVOLUTION.map((b) => (
                <li key={b} className="text-sm text-[#e0f4ff] flex gap-2">
                  <span className="text-[#00e5ff]">·</span>
                  {b}
                </li>
              ))}
            </ul>
            <Callout tone="success">&quot;{GP365_INTERVIEW_LINE}&quot;</Callout>
            <p className="text-sm text-[#00e5ff] mt-4 font-medium">{GP_STRATEGIC_QUESTION}</p>
          </SectionCard>

          <SectionCard title="Microsoft GP resources">
            <ul className="space-y-3">
              {GP_MICROSOFT_RESOURCES.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#00e5ff] hover:underline"
                  >
                    {r.label}
                  </a>
                  <p className="text-xs text-[#6b8fa8] mt-0.5">{r.note}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </>
      )}

      {openHorizon === "h3" && (
        <>
          <SectionCard title="Today vs future (client-facing service)">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#6b8fa8] text-left border-b border-[#1e3a50]">
                    <th className="py-2 pr-4">Today</th>
                    <th className="py-2">Future with AI + IoT</th>
                  </tr>
                </thead>
                <tbody>
                  {SERVICE_EVOLUTION_TABLE.map((row) => (
                    <tr key={row.today} className="border-b border-[#1e3a50]/40">
                      <td className="py-2 pr-4 text-[#e0f4ff]">{row.today}</td>
                      <td className="py-2 text-[#00e5ff]">{row.future}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="IoT foundation">
            <ul className="space-y-1">
              {IOT_FOUNDATION.map((l) => (
                <li key={l} className="text-sm text-[#e0f4ff]">
                  · {l}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="AI failure prediction example">
            <p className="text-sm text-[#e0f4ff]">{AI_FAILURE_EXAMPLE}</p>
          </SectionCard>

          <SectionCard title="Technician copilot briefing">
            <pre className="text-xs text-[#6b8fa8] whitespace-pre-wrap">{TECHNICIAN_BRIEFING}</pre>
          </SectionCard>

          <SectionCard title="Equipment Intelligence Dashboard (mock)">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#6b8fa8] text-left border-b border-[#1e3a50]">
                    <th className="py-2">Asset</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Health</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {EQUIPMENT_DASHBOARD_ROWS.map((r) => (
                    <tr key={r.asset} className="border-b border-[#1e3a50]/40">
                      <td className="py-2 text-[#e0f4ff]">{r.asset}</td>
                      <td className="py-2">{r.status}</td>
                      <td className="py-2">{r.health}</td>
                      <td className="py-2 text-[#00e5ff]">{r.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Recurring revenue tiers">
            {RECURRING_TIERS.map((t) => (
              <div key={t.name} className="mb-4 last:mb-0">
                <h4 className="text-[#00e5ff] font-medium text-sm mb-2">{t.name}</h4>
                <ul className="space-y-1">
                  {t.includes.map((i) => (
                    <li key={i} className="text-sm text-[#e0f4ff]">
                      · {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </SectionCard>

          <SectionCard title="Closed-loop service system">
            <p className="text-[#00e5ff] text-sm font-mono mb-2">{CLOSED_LOOP}</p>
            <p className="text-sm text-[#e0f4ff]">
              Your seat maps the loop between Operations, Service, Sales, IT, and Customers.
            </p>
          </SectionCard>

          <SectionCard title="Proactive revenue example">
            <p className="text-sm text-[#e0f4ff]">{PROACTIVE_REVENUE_EXAMPLE}</p>
          </SectionCard>

          <Callout tone="success">
            <p className="font-medium mb-2">90-second strategic pitch</p>
            <p className="text-sm">{STRATEGIC_PITCH}</p>
            <p className="text-xs text-[#6b8fa8] mt-3">
              When to use: {WHEN_TO_USE_PITCH.join("; ")}
            </p>
          </Callout>
        </>
      )}
    </div>
  );
}
