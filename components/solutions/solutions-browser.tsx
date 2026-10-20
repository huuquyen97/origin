"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { SolutionCard, type SolutionCardProps } from "@/components/cards";
import { T } from "@/lib/strings";

export function SolutionsBrowser({ solutions }: { solutions: SolutionCardProps[] }) {
  return <SolutionsBrowserView solutions={solutions} initialIndustry={useSearchParams().get("industry") ?? ""} />;
}

export function SolutionsBrowserView({ solutions, initialIndustry }: { solutions: SolutionCardProps[]; initialIndustry: string }) {
  const [cur, setCur] = useState(initialIndustry);
  const industries = [...new Set(solutions.map((s) => s.industry))];
  const list = solutions.filter((s) => !cur || s.industry === cur);
  return (
    <>
      <div className="scrollbar-none mb-6.5 flex gap-2 overflow-x-auto pb-0.5">
        <button type="button" className="pill" aria-pressed={!cur} onClick={() => setCur("")}>{T.all}</button>
        {industries.map((i) => (
          <button key={i} type="button" className="pill" aria-pressed={cur === i} onClick={() => setCur(i)}>
            {i} <span className="count">{solutions.filter((s) => s.industry === i).length}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">{list.map((s) => <SolutionCard key={s.slug} s={s} />)}</div>
    </>
  );
}
