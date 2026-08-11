"use client";

import { useEffect, useState } from "react";
import { ENTRIES } from "./data/glossary";
import { AboutFloryTab } from "./components/AboutFloryTab";
import { ApplyItTab } from "./components/ApplyItTab";
import { ConversationTab } from "./components/ConversationTab";
import { CoursesTab } from "./components/CoursesTab";
import { EthicsMoocTab } from "./components/EthicsMoocTab";
import { GlossaryTab } from "./components/GlossaryTab";
import { InterviewTab } from "./components/InterviewTab";
import { JobPrepTab } from "./components/JobPrepTab";
import { FloryTabId, TabNav, TABS } from "./components/TabNav";

function tabFromHash(): FloryTabId {
  if (typeof window === "undefined") return "glossary";
  const hash = window.location.hash.replace("#", "") as FloryTabId;
  return TABS.some((t) => t.id === hash) ? hash : "glossary";
}

export default function FloryJobPrepHub() {
  const [active, setActive] = useState<FloryTabId>("glossary");

  useEffect(() => {
    setActive(tabFromHash());
    const onHash = () => setActive(tabFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="min-h-screen bg-[#050b14] text-[#e0f4ff] px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[#00e5ff] text-2xl font-bold tracking-wider">MHG</span>
          <span className="text-[#6b8fa8] text-sm">| Interview Prep</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Flory BPDA · Full Job Prep Hub</h1>
        <p className="text-[#6b8fa8] text-sm mb-4">
          Business Process Data Administrator · Salida, CA · {ENTRIES.length} glossary terms · 8 study areas
        </p>

        <TabNav active={active} onChange={setActive} />

        <div className="pb-12">
          {active === "glossary" && <GlossaryTab />}
          {active === "about" && <AboutFloryTab />}
          {active === "courses" && <CoursesTab />}
          {active === "ethics" && <EthicsMoocTab />}
          {active === "jobprep" && <JobPrepTab />}
          {active === "interview" && <InterviewTab />}
          {active === "conversation" && <ConversationTab />}
          {active === "applyit" && <ApplyItTab />}
        </div>

        <footer className="pt-6 border-t border-[#1e3a50] text-center text-[#6b8fa8] text-xs">
          Flory Industries · Business Process Data Administrator · MHG Strategy
        </footer>
      </div>
    </div>
  );
}
