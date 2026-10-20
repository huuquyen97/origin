"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Copy, Search } from "lucide-react";
import { DocIcon, DocStatusTag, docStatusText } from "@/components/cards";
import { copyText } from "@/components/toast";
import type { DocStatus, DocType } from "@/lib/data/schema";
import { matchesAll } from "@/lib/search/normalize";
import { DOC_STATUS, DOC_TYPE_LABEL, T } from "@/lib/strings";

export type DocItem = {
  path: string; url: string; ext: string; title: string; type: DocType; description: string; topic: string; products: { slug: string; model: string }[];
  status: DocStatus; statusNote: string; validFrom: string; validTo: string;
};
type F = { status: string; type: string; topic: string; q: string };
type FacetKey = "status" | "type" | "topic";

function match(d: DocItem, f: F, skip?: FacetKey) {
  return (skip === "status" || !f.status || d.status === f.status) && (skip === "type" || !f.type || d.type === f.type) &&
    (skip === "topic" || !f.topic || d.topic === f.topic) && matchesAll(f.q, `${d.title} ${d.description} ${d.path} ${d.products.map((p) => p.model).join(" ")}`);
}

export function DocsBrowser({ docs }: { docs: DocItem[] }) {
  return <DocsBrowserView docs={docs} initial={Object.fromEntries(useSearchParams())} />;
}

export function DocsBrowserView({ docs, initial }: { docs: DocItem[]; initial: Record<string, string> }) {
  const router = useRouter();
  const pathname = usePathname();
  const [f, setF] = useState<F>({ status: initial.status ?? "", type: initial.type ?? "", topic: initial.topic ?? "", q: initial.q ?? "" });

  useEffect(() => {
    const u = new URLSearchParams();
    (Object.keys(f) as (keyof F)[]).forEach((k) => f[k] && u.set(k, f[k]));
    router.replace(u.size ? `${pathname}?${u}` : pathname, { scroll: false });
  }, [f, pathname, router]);

  const types = [...new Set(docs.map((d) => d.type))];
  const topics = [...new Set(docs.map((d) => d.topic))];
  const res = docs.filter((d) => match(d, f));

  // Số đếm theo các bộ lọc khác đang chọn
  const row = (key: FacetKey, label: string, opts: { v: string; l: string }[]) => {
    const base = docs.filter((d) => match(d, f, key));
    return (
      <div className="min-w-0">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-faint">{label}</div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="pill" aria-pressed={!f[key]} onClick={() => setF((x) => ({ ...x, [key]: "" }))}>{T.all}</button>
          {opts.map((o) => ({ ...o, c: base.filter((d) => d[key] === o.v).length })).filter((o) => o.c || f[key] === o.v).map((o) => (
            <button key={o.v} type="button" className="pill" aria-pressed={f[key] === o.v} onClick={() => setF((x) => ({ ...x, [key]: x[key] === o.v ? "" : o.v }))}>
              {o.l} <span className="count">{o.c}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-6.5 grid grid-cols-[minmax(0,1fr)] gap-3.5">
        <label className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-white px-4 transition focus-within:border-ink">
          <Search className="size-[17px] text-muted" aria-hidden />
          <input type="search" value={f.q} onChange={(e) => setF((x) => ({ ...x, q: e.target.value }))} placeholder="Tìm tên tài liệu…" aria-label="Tìm tài liệu" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
        </label>
        {row("status", "Trạng thái", (Object.keys(DOC_STATUS) as DocStatus[]).map((t) => ({ v: t, l: DOC_STATUS[t].label })))}
        {row("type", "Loại tài liệu", types.map((t) => ({ v: t, l: DOC_TYPE_LABEL[t] })))}
        {row("topic", "Dòng sản phẩm / chủ đề", topics.map((t) => ({ v: t, l: t })))}
      </div>
      <div className="mb-4 text-[13.5px] text-muted"><b className="text-ink">{res.length}</b> tài liệu</div>
      {res.length ? (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {res.map((d) => (
            <div key={d.path} className="card gap-2.5 p-3.5">
              <div className="grid grid-cols-[auto_1fr] items-start gap-3.5">
                <DocIcon ext={d.ext} />
                <div className="min-w-0">
                  <a href={d.url} target="_blank" rel="noopener" className="text-[15px] font-semibold leading-snug [overflow-wrap:anywhere] hover:underline">{d.title}</a>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-muted"><DocStatusTag status={d.status} />{DOC_TYPE_LABEL[d.type]} · {d.topic}</div>
                  {docStatusText(d) && <p className={`mt-2 text-[13px] ${d.status === "public" ? "text-muted" : "font-medium text-ink"}`}>{docStatusText(d)}</p>}
                  {d.description && <p className="mt-2 text-[13.5px] text-ink-2">{d.description}</p>}
                </div>
              </div>
              {d.products.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {d.products.slice(0, 6).map((p) => <Link key={p.slug} className="tag hover:bg-line" href={`/san-pham/${p.slug}`}>{p.model}</Link>)}
                </div>
              )}
              <div className="mt-auto flex gap-2">
                <a className="btn btn-dark btn-sm" href={d.url} target="_blank" rel="noopener">Mở <ArrowUpRight /></a>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => copyText(new URL(d.url, location.origin).href)}><Copy /> Copy link</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl2 border border-dashed border-line-2 px-5 py-14 text-center text-muted"><b className="mb-1 block text-base text-ink">Không có tài liệu phù hợp</b></div>
      )}
    </>
  );
}
