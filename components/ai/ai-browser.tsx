"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { matchesAll } from "@/lib/search/normalize";
import { T } from "@/lib/strings";

export type AiItem = { name: string; nameVi: string; category: string; description: string; supportedOn: string[]; source?: { url: string; label: string } };

export function AiBrowser({ items }: { items: AiItem[] }) {
  return <AiBrowserView items={items} initialQuery={useSearchParams().get("q") ?? ""} />;
}

export function AiBrowserView({ items, initialQuery }: { items: AiItem[]; initialQuery: string }) {
  const [q, setQ] = useState(initialQuery);
  const [cat, setCat] = useState("");
  const cats = [...new Set(items.map((a) => a.category).filter(Boolean))];
  const res = useMemo(
    () => items.filter((a) => (!cat || a.category === cat) && matchesAll(q, `${a.name} ${a.nameVi} ${a.description} ${a.category} ${a.supportedOn.join(" ")}`)),
    [items, q, cat],
  );
  return (
    <>
      <div className="mb-6.5 grid grid-cols-[minmax(0,1fr)] gap-3.5">
        <label className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-white px-4 transition focus-within:border-ink">
          <Search className="size-[17px] text-muted" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm thuật toán: khuôn mặt, biển số, xâm nhập…" aria-label="Tìm thuật toán AI" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
        </label>
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-0.5">
          <button type="button" className="pill" aria-pressed={!cat} onClick={() => setCat("")}>{T.all}</button>
          {cats.map((c) => (
            <button key={c} type="button" className="pill" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c} <span className="count">{items.filter((a) => a.category === c).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 text-[13.5px] text-muted"><b className="text-ink">{res.length}</b> thuật toán</div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {res.map((a, i) => (
          <div key={`${a.name}-${i}`} className="grid min-w-0 content-start gap-2 rounded-2xl border border-line bg-white p-4.5">
            {a.category && <span className="tag tag-navy justify-self-start">{a.category}</span>}
            <div className="text-[15px] font-semibold tracking-tight">{a.name}</div>
            {a.nameVi && a.nameVi !== a.name && <div className="-mt-1 text-[13px] text-muted">{a.nameVi}</div>}
            <div className="text-[13.5px] text-ink-2">{a.description}</div>
            {a.supportedOn.length > 0 && (
              <div className="flex flex-wrap gap-1.5">{a.supportedOn.map((x) => <span key={x} className="tag h-auto whitespace-normal py-1 leading-snug">{x}</span>)}</div>
            )}
            {a.source && <a href={a.source.url} target="_blank" rel="noopener" className="text-xs text-muted underline underline-offset-2">Nguồn: {a.source.label}</a>}
          </div>
        ))}
      </div>
    </>
  );
}
