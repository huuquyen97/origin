"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import { matchesAll } from "@/lib/search/normalize";
import { CATALOG, T } from "@/lib/strings";

export type CatalogRow = { model: string; series: string; mp: string; form: string; connect: string; soc: string; env: string; slug: string | null; conflict: string | null };
type SeriesMeta = { id: string; short: string };
type Key = "series" | "form" | "mp" | "connect" | "env";
type Filters = Record<Key, string>;
type Props = { rows: CatalogRow[]; series: SeriesMeta[]; envLegend: Record<string, string> };

const EMPTY: Filters = { series: "", form: "", mp: "", connect: "", env: "" };
/** "PTZ 37x" → "PTZ" để lọc theo kiểu dáng */
const formType = (form: string) => form.split(" ")[0];
const valueOf = (r: CatalogRow, k: Key) => (k === "form" ? formType(r.form) : r[k]);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Đọc ?q= (link từ tìm kiếm / trang sản phẩm); bọc trong <Suspense fallback={<CatalogTableView … initialQ="" />}> */
export function CatalogTable(props: Props) {
  return <CatalogTableView {...props} initialQ={useSearchParams().get("q") ?? ""} />;
}

export function CatalogTableView({ rows, series, envLegend, initialQ }: Props & { initialQ: string }) {
  const [f, setF] = useState<Filters>(EMPTY);
  const [q, setQ] = useState(initialQ);
  const short = (id: string) => series.find((s) => s.id === id)?.short ?? id;
  const env = (code: string) => cap(envLegend[code] ?? code);

  const passes = (r: CatalogRow, skip?: Key) =>
    (Object.keys(f) as Key[]).every((k) => k === skip || !f[k] || valueOf(r, k) === f[k]) && matchesAll(q, `${r.model} ${r.form} ${r.soc} ${short(r.series)}`);
  const shown = rows.filter((r) => passes(r));

  const groups = useMemo(() => {
    const opts = (k: Key) => [...new Set(rows.map((r) => valueOf(r, k)))];
    return [
      { k: "series" as Key, label: CATALOG.filters.series, opts: series.filter((s) => rows.some((r) => r.series === s.id)).map((s) => ({ v: s.id, l: `${s.id} · ${s.short}` })) },
      { k: "form" as Key, label: CATALOG.filters.form, opts: opts("form").map((v) => ({ v, l: v })) },
      { k: "mp" as Key, label: CATALOG.filters.mp, opts: opts("mp").sort().map((v) => ({ v, l: v })) },
      { k: "connect" as Key, label: CATALOG.filters.connect, opts: opts("connect").map((v) => ({ v, l: v })) },
      { k: "env" as Key, label: CATALOG.filters.env, opts: opts("env").map((v) => ({ v, l: cap(envLegend[v] ?? v) })) },
    ];
  }, [rows, series, envLegend]);

  const set = (k: Key, v: string) => setF((x) => ({ ...x, [k]: x[k] === v ? "" : v }));
  const active = q || (Object.keys(f) as Key[]).some((k) => f[k]);

  const modelCell = (r: CatalogRow) => (
    <span className="inline-flex items-center gap-1.5">
      {r.slug ? (
        <Link href={`/san-pham/${r.slug}`} className="font-bold tabular-nums text-brand-navy underline underline-offset-2">{r.model}</Link>
      ) : (
        <span className="font-bold tabular-nums">{r.model}</span>
      )}
      {r.conflict && (
        <span title={r.conflict} className="inline-flex text-brand-gold-700">
          <AlertTriangle className="size-4" aria-hidden />
          <span className="sr-only">{r.conflict}</span>
        </span>
      )}
    </span>
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <label className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-white px-4 transition focus-within:border-ink">
        <Search className="size-[17px] text-muted" aria-hidden />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Lọc theo model, kiểu dáng, SoC…" aria-label="Lọc danh mục model" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
      </label>

      <div className="grid gap-3">
        {groups.map((g) => (
          <div key={g.k} className="flex flex-wrap items-center gap-2">
            <span className="w-full text-[13px] font-semibold text-muted md:w-28">{g.label}</span>
            {g.opts.map((o) => {
              const n = rows.filter((r) => passes(r, g.k) && valueOf(r, g.k) === o.v).length;
              return (
                <button key={o.v} type="button" className="pill" aria-pressed={f[g.k] === o.v} onClick={() => set(g.k, o.v)} disabled={!n && f[g.k] !== o.v}>
                  {o.l} <span className="count">{n}</span>
                </button>
              );
            })}
          </div>
        ))}
        {active && (
          <button type="button" className="pill justify-self-start" onClick={() => { setF(EMPTY); setQ(""); }}>{T.clearFilters}</button>
        )}
      </div>

      <p className="text-[14px] text-muted" aria-live="polite">
        <b className="text-ink">{shown.length}</b> / {rows.length} model · {CATALOG.legend}
      </p>

      {/* Desktop: bảng */}
      <div className="hidden overflow-x-auto rounded-xl2 border border-line md:block">
        <table className="w-full text-left text-[14.5px]">
          <thead className="bg-surface text-[13px] text-muted">
            <tr>
              {Object.values(CATALOG.cols).map((c) => <th key={c} scope="col" className="px-4 py-3 font-semibold">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.model} className="border-t border-line">
                <td className="px-4 py-3">{modelCell(r)}</td>
                <td className="px-4 py-3"><span className="tag tag-navy">{r.series} · {short(r.series)}</span></td>
                <td className="px-4 py-3 tabular-nums">{r.mp}</td>
                <td className="px-4 py-3">{r.form}</td>
                <td className="px-4 py-3">{r.connect}</td>
                <td className="px-4 py-3">{r.soc}</td>
                <td className="px-4 py-3">{env(r.env)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: thẻ */}
      <ul className="grid gap-2.5 md:hidden">
        {shown.map((r) => (
          <li key={r.model} className="rounded-xl2 border border-line bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {modelCell(r)}
              <span className="tag tag-navy">{r.series} · {short(r.series)}</span>
            </div>
            <p className="mt-2 text-[14px] text-ink-2">{r.mp} · {r.form} · {r.connect} · {r.soc}</p>
            <p className="mt-1 text-[13px] text-muted">{env(r.env)}{!r.slug && ` · ${CATALOG.noPage}`}</p>
          </li>
        ))}
      </ul>

      {!shown.length && <p className="rounded-xl2 bg-surface p-6 text-center text-muted">{CATALOG.empty}</p>}
    </div>
  );
}
