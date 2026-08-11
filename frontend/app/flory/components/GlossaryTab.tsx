"use client";

import { useMemo, useState } from "react";
import { CAT_COLOR, CATS, ENTRIES } from "../data/glossary";
import { SectionCard } from "./SectionCard";

function badge(cat: string) {
  const cls = CAT_COLOR[cat] ?? "bg-zinc-800 text-zinc-300 border-zinc-700";
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded border ${cls}`}>
      {cat}
    </span>
  );
}

export function GlossaryTab() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    return ENTRIES.filter((e) => {
      if (cat !== "All" && e.cat !== cat) return false;
      if (!term) return true;
      return (
        e.term.toLowerCase().includes(term) ||
        e.def.toLowerCase().includes(term) ||
        e.say.toLowerCase().includes(term)
      );
    });
  }, [q, cat]);

  return (
    <div className="space-y-4">
      <SectionCard>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search terms, definitions, say-it lines..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 bg-[#050b14] border border-[#1e3a50] rounded-lg px-4 py-2 text-[#e0f4ff] placeholder-[#6b8fa8] text-sm focus:outline-none focus:border-[#00e5ff]"
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="bg-[#050b14] border border-[#1e3a50] rounded-lg px-3 py-2 text-[#e0f4ff] text-sm md:w-64"
          >
            {CATS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <p className="text-[#6b8fa8] text-xs mt-3">
          Honest gaps: Dynamics GP (ramp), Power Platform (ramp), formal Lean belt (MBA + CI outcomes, not cert).
        </p>
      </SectionCard>

      <p className="text-[#6b8fa8] text-sm">
        Showing {results.length} of {ENTRIES.length} terms
      </p>

      <div className="space-y-2">
        {results.map((e) => (
          <div
            key={e.n}
            className="bg-[#0d1b2a] border border-[#1e3a50] rounded-xl overflow-hidden cursor-pointer hover:border-[#00e5ff]/40"
            onClick={() => setOpen(open === e.n ? null : e.n)}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-[#6b8fa8] text-xs w-8 text-right shrink-0">{e.n}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#e0f4ff] text-sm">{e.term}</span>
                  {badge(e.cat)}
                </div>
                {open !== e.n && (
                  <p className="text-[#6b8fa8] text-xs mt-0.5 truncate">{e.def}</p>
                )}
              </div>
              <span className="text-[#6b8fa8] text-xs">{open === e.n ? "▲" : "▼"}</span>
            </div>
            {open === e.n && (
              <div className="border-t border-[#1e3a50] px-4 py-3 space-y-3">
                <p className="text-[#e0f4ff] text-sm">{e.def}</p>
                <div className="bg-[#050b14] border border-[#1e3a50] rounded-lg px-3 py-2">
                  <div className="text-[#00e5ff] text-xs uppercase mb-1">Say it</div>
                  <p className="text-[#e0f4ff] text-sm italic">&quot;{e.say}&quot;</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
