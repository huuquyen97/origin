"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { ProductCard } from "@/components/cards";
import { toast } from "@/components/toast";
import type { ProductCardData } from "@/lib/data";
import { matchesAll } from "@/lib/search/normalize";
import { T } from "@/lib/strings";
import { useCompare, writeCompare, MAX_COMPARE } from "./compare-store";

type SeriesOpt = { id: string; name: string };
type Filters = { series: string; category: string; res: string; ai: string; q: string };
const KEYS: (keyof Filters)[] = ["series", "category", "res", "ai", "q"];

type Props = { products: ProductCardData[]; series: SeriesOpt[] };

/** Đọc bộ lọc từ URL; dùng trong <Suspense fallback={<ProductBrowserView initial={{}} … />}> để HTML tĩnh vẫn có danh sách. */
export function ProductBrowser(props: Props) {
  return <ProductBrowserView {...props} initial={Object.fromEntries(useSearchParams())} />;
}

export function ProductBrowserView({ products, series, initial }: Props & { initial: Record<string, string> }) {
  const router = useRouter();
  const pathname = usePathname();
  const [f, setF] = useState<Filters>(() => Object.fromEntries(KEYS.map((k) => [k, initial[k] ?? ""])) as Filters);
  const stored = useCompare();
  const sel = stored.filter((s) => products.some((p) => p.slug === s));

  useEffect(() => {
    const u = new URLSearchParams();
    KEYS.forEach((k) => f[k] && u.set(k, f[k]));
    const qs = u.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [f, pathname, router]);

  const count = (fn: (p: ProductCardData) => boolean) => products.filter(fn).length;
  const uniq = (a: string[]) => [...new Set(a.filter(Boolean))];
  const cats = uniq(products.map((p) => p.category)).sort();
  const ress = uniq(products.map((p) => p.resolution)).sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b));
  const ais = uniq(products.flatMap((p) => p.aiFeatures)).sort();

  const res = useMemo(
    () => products.filter((p) =>
      (!f.series || p.series === f.series) && (!f.category || p.category === f.category) && (!f.res || p.resolution === f.res) &&
      (!f.ai || p.aiFeatures.includes(f.ai)) && matchesAll(f.q, `${p.seriesName} ${p.searchText}`)),
    [products, f],
  );

  const set = (k: keyof Filters, v: string) => setF((x) => ({ ...x, [k]: v }));
  const toggle = (slug: string, on: boolean) => {
    let next = sel.filter((s) => s !== slug);
    if (on) {
      if (next.length >= MAX_COMPARE) return toast(`Tối đa ${MAX_COMPARE} sản phẩm`);
      next = [...next, slug];
    }
    writeCompare(next);
  };

  const row = (key: keyof Filters, label: string, opts: { v: string; l: string; c: number }[]) => (
    <div className="min-w-0">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-faint">{label}</div>
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-0.5">
        <button type="button" className="pill" aria-pressed={!f[key]} onClick={() => set(key, "")}>{T.all}</button>
        {opts.map((o) => (
          <button key={o.v} type="button" className="pill" aria-pressed={f[key] === o.v} onClick={() => set(key, o.v)}>
            {o.l} <span className="count">{o.c}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const active = KEYS.some((k) => f[k]);
  return (
    <>
      <div className="mb-6.5 grid grid-cols-[minmax(0,1fr)] gap-3.5">
        <label className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-white px-4 transition focus-within:border-ink">
          <Search className="size-[17px] text-muted" aria-hidden />
          <input type="search" value={f.q} onChange={(e) => set("q", e.target.value)} placeholder="Lọc theo model, tên, thông số…" aria-label="Lọc sản phẩm" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
        </label>
        {row("series", "Dòng sản phẩm", series.map((s) => ({ v: s.id, l: s.name, c: count((p) => p.series === s.id) })).filter((o) => o.c))}
        {row("category", "Loại thiết bị", cats.map((c) => ({ v: c, l: c, c: count((p) => p.category === c) })))}
        {row("res", "Độ phân giải", ress.map((c) => ({ v: c, l: c, c: count((p) => p.resolution === c) })))}
        {ais.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-faint">Tính năng AI</div>
            <select value={f.ai} onChange={(e) => set("ai", e.target.value)} aria-label="Tính năng AI" className="h-10 max-w-full rounded-full border border-line bg-white px-3.5 text-[13.5px]">
              <option value="">Tất cả tính năng AI</option>
              {ais.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-[13.5px] text-muted">
        <span><b className="text-ink">{res.length}</b> sản phẩm</span>
        {active && <button type="button" className="pill" onClick={() => setF({ series: "", category: "", res: "", ai: "", q: "" })}>{T.clearFilters}</button>}
      </div>

      {res.length ? (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {res.map((p) => (
            <ProductCard
              key={p.slug}
              p={p}
              compare={
                <label className="absolute right-5.5 top-5.5 z-10 inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-white/95 px-2.5 text-xs font-medium text-ink-2">
                  <input type="checkbox" className="accent-ink" checked={sel.includes(p.slug)} onChange={(e) => toggle(p.slug, e.target.checked)} />
                  {T.compare}
                </label>
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl2 border border-dashed border-line-2 px-5 py-14 text-center text-muted">
          <b className="mb-1 block text-base text-ink">Không có sản phẩm phù hợp</b>
          Thử bỏ bớt bộ lọc hoặc tìm theo từ khóa khác.
        </div>
      )}

      <div className={`fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-2.5 rounded-full bg-ink py-2 pl-4.5 pr-2 text-[13.5px] text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,.5)] transition-transform duration-300 ${sel.length ? "translate-y-0" : "translate-y-[140%]"}`}>
        <span>{sel.length}/{MAX_COMPARE} đã chọn</span>
        <button type="button" className="min-h-[38px] px-1.5 text-[13px] text-white/65" onClick={() => writeCompare([])}>Bỏ chọn</button>
        <Link className="btn btn-light btn-sm" href={`/so-sanh?ids=${sel.join(",")}`}>So sánh <ArrowRight /></Link>
      </div>
    </>
  );
}
