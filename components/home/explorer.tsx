"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export type ExplorerSeries = { id: string; name: string; kind: string; tagline: string; description: string; highlights: string[]; image: string; solution: string; count: number };

export function Explorer({ series }: { series: ExplorerSeries[] }) {
  const [cur, setCur] = useState(0);
  const s = series[cur];
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const n = (cur + (e.key === "ArrowDown" ? 1 : -1) + series.length) % series.length;
    setCur(n);
    (e.currentTarget.querySelectorAll("button")[n] as HTMLButtonElement | undefined)?.focus();
  };

  return (
    <div className="grid gap-3.5 md:grid-cols-[1.05fr_1fr]">
      <div role="tablist" aria-label="Dòng sản phẩm" onKeyDown={onKey} className="rounded-xl2 border border-line bg-white p-2.5">
        {series.map((x, i) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={i === cur}
            onClick={() => setCur(i)}
            className="grid w-full grid-cols-[1fr_auto] items-center gap-3.5 rounded-[14px] px-4 py-3.5 text-left transition hover:bg-surface aria-selected:bg-surface-2"
          >
            <span>
              <span className="block text-[15px] font-semibold tracking-tight">{x.name}</span>
              <span className="block text-[13px] text-muted">{x.tagline}</span>
            </span>
            <span className="text-[12.5px] tabular-nums text-faint">{x.count} model</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-live="polite" className="shade-panel relative isolate flex min-h-[360px] flex-col justify-end overflow-hidden rounded-xl2 bg-dark text-white">
        {s.image && <Image key={s.image} src={s.image} alt="" fill sizes="(min-width: 768px) 600px, 100vw" className="-z-20 object-cover" />}
        <div className="grid justify-items-start gap-3 p-6.5">
          <span className="tag tag-dark">{s.kind}</span>
          <h3 className="heading-2 !text-[clamp(24px,2.6vw,32px)]">{s.name}</h3>
          <p className="line-clamp-3 max-w-[52ch] text-[14.5px] text-white/80">{s.description}</p>
          {s.highlights.length > 0 && (
            <ul className="grid gap-1.5 border-l border-white/25 pl-3 text-[13.5px] text-white/80">
              {s.highlights.slice(0, 3).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          <div className="mt-1.5 flex flex-wrap gap-2">
            <Link className="btn btn-light btn-sm" href={`/san-pham?series=${s.id}`}>Xem {s.count} sản phẩm <ArrowRight /></Link>
            {s.solution && <Link className="btn btn-glass btn-sm" href={`/giai-phap/${s.solution}`}>Giải pháp liên quan</Link>}
          </div>
        </div>
      </div>
    </div>
  );
}
