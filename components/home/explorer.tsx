"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type ExplorerSeries = { id: string; name: string; kind: string; tagline: string; description: string; highlights: string[]; image: string; solution: string; count: number };

const AUTO_MS = 7000;

/**
 * Khối chọn dòng sản phẩm kiểu "Công nghệ cốt lõi" của Hikvision: thanh tab có vạch tiến trình,
 * tự chuyển tab sau AUTO_MS (dừng khi rê chuột / focus / prefers-reduced-motion), nút tròn + chấm.
 */
export function Explorer({ series }: { series: ExplorerSeries[] }) {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const tabs = useRef<HTMLDivElement>(null);
  const s = series[cur];
  const auto = !paused && !reduced;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    const t = setTimeout(on);
    mq.addEventListener("change", on);
    return () => { clearTimeout(t); mq.removeEventListener("change", on); };
  }, []);

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setCur((c) => (c + 1) % series.length), AUTO_MS);
    return () => clearTimeout(t);
  }, [auto, cur, series.length]);

  const go = (n: number) => {
    const i = (n + series.length) % series.length;
    setCur(i);
    (tabs.current?.children[i] as HTMLElement | undefined)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (cur + (e.key === "ArrowRight" ? 1 : -1) + series.length) % series.length;
    go(n);
    (tabs.current?.children[n] as HTMLButtonElement | undefined)?.focus();
  };

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div ref={tabs} role="tablist" aria-label="Dòng sản phẩm" onKeyDown={onKey} className="scrollbar-none grid auto-cols-[minmax(150px,1fr)] grid-flow-col gap-5 overflow-x-auto md:gap-8">
        {series.map((x, i) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={i === cur}
            tabIndex={i === cur ? 0 : -1}
            data-progress={i === cur && auto ? "true" : undefined}
            style={{ "--tab-ms": `${AUTO_MS}ms` } as React.CSSProperties}
            onClick={() => go(i)}
            className={`tab-btn ${i === cur ? "text-white" : "text-white/55 hover:text-white/85"}`}
          >
            <span>{x.name}</span>
            <span className="text-[13px] font-normal opacity-70">{x.count} model</span>
            <span className="tab-bar" key={`${cur}-${auto}`} />
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-live="polite" className="mt-9 grid items-center gap-7 md:mt-12 md:grid-cols-[1.15fr_1fr] md:gap-14">
        <div key={s.id} className="tab-fade relative aspect-[16/10] overflow-hidden rounded-xl2 bg-white/5">
          {s.image && <Image src={s.image} alt={s.name} fill sizes="(min-width: 768px) 760px, 100vw" className="object-cover" />}
        </div>
        <div key={`${s.id}-t`} className="tab-fade grid justify-items-start gap-4">
          <span className="text-[15px] font-semibold text-brand-gold">{s.kind}</span>
          <h3 className="heading-3">{s.name} — {s.tagline}</h3>
          <p className="line-clamp-4 text-base text-white/80">{s.description}</p>
          {s.highlights.length > 0 && (
            <ul className="grid gap-2 text-[15px] text-white/80">
              {s.highlights.slice(0, 3).map((h) => (
                <li key={h} className="grid grid-cols-[auto_1fr] gap-2.5"><ArrowRight className="mt-1 size-4 text-brand-gold" aria-hidden />{h}</li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex flex-wrap gap-2.5">
            <Link className="btn btn-outline-light" href={`/san-pham?series=${s.id}`}>Xem {s.count} sản phẩm</Link>
            {s.solution && <Link className="btn btn-glass" href={`/giai-phap/${s.solution}`}>Giải pháp liên quan</Link>}
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-8">
        <button type="button" onClick={() => go(cur - 1)} aria-label="Dòng trước" className="round-nav bg-white/12 text-white hover:bg-white/20"><ChevronLeft className="size-5" /></button>
        <div className="flex items-center gap-1">
          {series.map((x, i) => (
            <button key={x.id} type="button" onClick={() => go(i)} aria-label={x.name} aria-current={i === cur} className="grid size-11 place-items-center">
              <span className={`block rounded-full transition-all duration-300 ${i === cur ? "size-3 border-2 border-white" : "size-2 bg-white/70"}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(cur + 1)} aria-label="Dòng sau" className="round-nav bg-white/12 text-white hover:bg-white/20"><ChevronRight className="size-5" /></button>
      </div>
    </div>
  );
}
