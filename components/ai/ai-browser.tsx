"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { matchesAll } from "@/lib/search/normalize";
import { T } from "@/lib/strings";

/** Một tính năng AI chuẩn: model hỗ trợ lấy từ datasheet sản phẩm, mô tả lấy từ tài liệu thuật toán */
export type AiItem = {
  id: string;
  name: string;
  nameVi: string;
  group: string;
  keywords: string[];
  products: { slug: string; model: string }[];
  descriptions: { text: string; source?: { url: string; label: string } }[];
  notes: string[];
};

export function AiBrowser({ items }: { items: AiItem[] }) {
  return <AiBrowserView items={items} initialQuery={useSearchParams().get("q") ?? ""} />;
}

export function AiBrowserView({ items, initialQuery }: { items: AiItem[]; initialQuery: string }) {
  const [q, setQ] = useState(initialQuery);
  const [group, setGroup] = useState("");
  const [onlyModels, setOnlyModels] = useState(false);
  const groups = [...new Set(items.map((a) => a.group).filter(Boolean))];
  const res = useMemo(
    () =>
      items.filter((a) =>
        (!group || a.group === group) && (!onlyModels || a.products.length > 0) &&
        matchesAll(q, `${a.name} ${a.nameVi} ${a.group} ${a.keywords.join(" ")} ${a.products.map((p) => p.model).join(" ")} ${a.descriptions.map((d) => d.text).join(" ")}`)),
    [items, q, group, onlyModels],
  );

  // Link /thuat-toan-ai#id từ trang sản phẩm: cuộn tới thẻ sau khi danh sách hiện
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <>
      <div className="mb-6.5 grid grid-cols-[minmax(0,1fr)] gap-3.5">
        <label className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-white px-4 transition focus-within:border-ink">
          <Search className="size-[17px] text-muted" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tính năng: khuôn mặt, biển số, đếm người…" aria-label="Tìm tính năng AI" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="pill" aria-pressed={!group} onClick={() => setGroup("")}>{T.all}</button>
          {groups.map((c) => (
            <button key={c} type="button" className="pill" aria-pressed={group === c} onClick={() => setGroup(group === c ? "" : c)}>
              {c} <span className="count">{items.filter((a) => a.group === c).length}</span>
            </button>
          ))}
          <button type="button" className="pill" aria-pressed={onlyModels} onClick={() => setOnlyModels((x) => !x)}>Chỉ tính năng đã có model</button>
        </div>
      </div>
      <div className="mb-4 text-[13.5px] text-muted"><b className="text-ink">{res.length}</b> tính năng AI</div>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {res.map((a) => (
          <div key={a.id} id={a.id} className="grid min-w-0 scroll-mt-6 content-start gap-2 rounded-2xl border border-line bg-white p-4.5 target:border-brand-navy target:ring-2 target:ring-brand-navy/20">
            {a.group && <span className="tag tag-navy justify-self-start">{a.group}</span>}
            <div className="text-[15px] font-semibold tracking-tight">{a.nameVi}</div>
            <div className="-mt-1 text-[13px] text-muted">{a.name}</div>
            {a.descriptions.map((d, i) => (
              <div key={i} className="text-[13.5px] text-ink-2">
                {d.text}
                {d.source && <a href={d.source.url} target="_blank" rel="noopener" className="mt-1 block text-xs text-muted underline underline-offset-2">Nguồn: {d.source.label}</a>}
              </div>
            ))}
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-faint">Model hỗ trợ</div>
            {a.products.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {a.products.map((p) => <Link key={p.slug} href={`/san-pham/${p.slug}`} className="pill tabular-nums">{p.model}</Link>)}
              </div>
            ) : (
              <div className="text-[13px] text-muted">Chưa có model nào ghi tính năng này trong datasheet.</div>
            )}
            {a.notes.map((n) => <div key={n} className="text-[12.5px] text-muted">{n}</div>)}
          </div>
        ))}
      </div>
    </>
  );
}
