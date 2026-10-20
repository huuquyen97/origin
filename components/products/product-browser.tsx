"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/cards";
import { toast } from "@/components/toast";
import type { ProductCardData } from "@/lib/data";
import { NEEDS, type NeedId } from "@/lib/labels";
import { matchesAll } from "@/lib/search/normalize";
import { T } from "@/lib/strings";
import { useCompare, writeCompare, MAX_COMPARE } from "./compare-store";

type Opt = { id: string; name: string };
/** need: nhiều giá trị, phân tách bằng dấu phẩy (lọc "và") */
type Filters = { series: string; category: string; res: string; ai: string; need: string; q: string };
const KEYS: (keyof Filters)[] = ["series", "category", "res", "ai", "need", "q"];
const EMPTY: Filters = { series: "", category: "", res: "", ai: "", need: "", q: "" };

type Props = { products: ProductCardData[]; series: Opt[]; aiFeatures: Opt[] };

/** Đọc bộ lọc từ URL; dùng trong <Suspense fallback={<ProductBrowserView initial={{}} … />}> để HTML tĩnh vẫn có danh sách. */
export function ProductBrowser(props: Props) {
  return <ProductBrowserView {...props} initial={Object.fromEntries(useSearchParams())} />;
}

const needList = (s: string) => s.split(",").filter(Boolean) as NeedId[];

function match(p: ProductCardData, f: Filters, skip?: keyof Filters) {
  const on = (k: keyof Filters) => k !== skip && f[k];
  return (
    (!on("series") || p.series === f.series) &&
    (!on("category") || p.category === f.category) &&
    (!on("res") || p.resolution === f.res) &&
    (!on("ai") || p.ai.includes(f.ai)) &&
    (!on("need") || needList(f.need).every((n) => p.needs.includes(n))) &&
    matchesAll(f.q, `${p.seriesName} ${p.searchText}`)
  );
}

export function ProductBrowserView({ products, series, aiFeatures, initial }: Props & { initial: Record<string, string> }) {
  const router = useRouter();
  const pathname = usePathname();
  const [f, setF] = useState<Filters>(() => Object.fromEntries(KEYS.map((k) => [k, initial[k] ?? ""])) as Filters);
  const [more, setMore] = useState(false);
  const stored = useCompare();
  const sel = stored.filter((s) => products.some((p) => p.slug === s));

  useEffect(() => {
    const u = new URLSearchParams();
    KEYS.forEach((k) => f[k] && u.set(k, f[k]));
    const qs = u.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [f, pathname, router]);

  // Số đếm của mỗi lựa chọn tính theo các bộ lọc khác đang chọn (bỏ qua chính nhóm đó)
  const pool = (k: keyof Filters) => products.filter((p) => match(p, f, k));
  const uniq = (a: string[]) => [...new Set(a.filter(Boolean))];
  const opts = (k: keyof Filters, values: { v: string; l: string }[], test: (p: ProductCardData, v: string) => boolean) => {
    const base = pool(k);
    return values.map((o) => ({ ...o, c: base.filter((p) => test(p, o.v)).length })).filter((o) => o.c || f[k] === o.v);
  };

  const cats = uniq(products.map((p) => p.category)).map((c) => ({ v: c, l: products.find((p) => p.category === c)!.categoryLabel })).sort((a, b) => a.l.localeCompare(b.l, "vi"));
  const ress = uniq(products.map((p) => p.resolution)).sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b)).map((r) => ({ v: r, l: r }));

  const res = useMemo(() => products.filter((p) => match(p, f)), [products, f]);

  const set = (k: keyof Filters, v: string) => setF((x) => ({ ...x, [k]: v }));
  const toggleNeed = (n: NeedId) => {
    const cur = needList(f.need);
    set("need", (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]).join(","));
  };
  const toggle = (slug: string, on: boolean) => {
    let next = sel.filter((s) => s !== slug);
    if (on) {
      if (next.length >= MAX_COMPARE) return toast(`Tối đa ${MAX_COMPARE} sản phẩm`);
      next = [...next, slug];
    }
    writeCompare(next);
  };

  const label = (text: string) => <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-faint">{text}</div>;
  const row = (key: keyof Filters, text: string, items: { v: string; l: string; c: number }[]) => (
    <div className="min-w-0">
      {label(text)}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="pill" aria-pressed={!f[key]} onClick={() => set(key, "")}>{T.all}</button>
        {items.map((o) => (
          <button key={o.v} type="button" className="pill" aria-pressed={f[key] === o.v} onClick={() => set(key, f[key] === o.v ? "" : o.v)}>
            {o.l} <span className="count">{o.c}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const needBase = pool("need");
  const aiOpts = opts("ai", aiFeatures.map((a) => ({ v: a.id, l: a.name })), (p, v) => p.ai.includes(v));
  const active = KEYS.some((k) => f[k]);
  const detailCount = (["series", "category", "res", "ai"] as const).filter((k) => f[k]).length;
  return (
    <>
      <div className="mb-6.5 grid grid-cols-[minmax(0,1fr)] gap-4.5">
        <label className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-white px-4 transition focus-within:border-ink">
          <Search className="size-[17px] text-muted" aria-hidden />
          <input type="search" value={f.q} onChange={(e) => set("q", e.target.value)} placeholder="Lọc theo model, tên, thông số…" aria-label="Lọc sản phẩm" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
        </label>
        <div className="min-w-0">
          {label("Nhu cầu của khách")}
          <div className="flex flex-wrap gap-2">
            {NEEDS.map((n) => {
              const on = needList(f.need).includes(n.id);
              const c = needBase.filter((p) => p.needs.includes(n.id) && needList(f.need).every((x) => p.needs.includes(x))).length;
              return (
                <button key={n.id} type="button" className="pill" aria-pressed={on} onClick={() => toggleNeed(n.id)}>
                  {n.label} <span className="count">{c}</span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Mobile: các bộ lọc chi tiết thu gọn sau một nút để danh sách hiện sớm */}
        <button type="button" className="pill justify-self-start md:hidden" aria-expanded={more} onClick={() => setMore((x) => !x)}>
          <SlidersHorizontal className="size-4" /> Bộ lọc chi tiết{detailCount > 0 && <span className="count">{detailCount}</span>}
          <ChevronDown className={`size-4 transition ${more ? "rotate-180" : ""}`} />
        </button>
        <div className={`${more ? "grid" : "hidden"} grid-cols-[minmax(0,1fr)] gap-4.5 md:grid`}>
          {row("series", "Dòng sản phẩm", opts("series", series.map((s) => ({ v: s.id, l: s.name })), (p, v) => p.series === v))}
          {row("category", "Loại thiết bị", opts("category", cats, (p, v) => p.category === v))}
          {row("res", "Độ phân giải", opts("res", ress, (p, v) => p.resolution === v))}
          <div className="min-w-0">
            {label("Tính năng AI")}
            <select value={f.ai} onChange={(e) => set("ai", e.target.value)} aria-label="Tính năng AI" className="h-11 w-full max-w-[420px] rounded-full border border-line bg-white px-3.5 text-[13.5px]">
              <option value="">Tất cả tính năng AI</option>
              {aiOpts.map((a) => <option key={a.v} value={a.v}>{a.l} ({a.c})</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-[13.5px] text-muted">
        <span><b className="text-ink">{res.length}</b> sản phẩm</span>
        {active && <button type="button" className="pill" onClick={() => setF(EMPTY)}>{T.clearFilters}</button>}
      </div>

      {res.length ? (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {res.map((p) => (
            <ProductCard
              key={p.slug}
              p={p}
              compare={
                <label className="absolute right-3.5 top-2 z-10 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-white/95 px-3.5 text-[13px] font-medium text-ink-2">
                  <input type="checkbox" className="size-4 accent-ink" checked={sel.includes(p.slug)} onChange={(e) => toggle(p.slug, e.target.checked)} />
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
        <button type="button" className="min-h-11 px-1.5 text-[13px] text-white/65" onClick={() => writeCompare([])}>Bỏ chọn</button>
        <Link className="btn btn-light btn-sm" href="/so-sanh">So sánh <ArrowRight /></Link>
      </div>
    </>
  );
}
