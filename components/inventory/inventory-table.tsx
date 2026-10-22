"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, ExternalLink, RefreshCw, Search } from "lucide-react";
import { stockStatus, type StockStatus } from "@/lib/inventory/types";
import { matchesAll } from "@/lib/search/normalize";
import { INV, T, vnDateTime } from "@/lib/strings";
import { useInventory } from "./use-inventory";

type Row = { slug: string; model: string; name: string; seriesName: string };
type Filter = "" | StockStatus | "none";

const STATUS_CLS = { ok: "tag-ok", low: "tag-warn", out: "tag-danger" } as const;

export function InventoryTable({ products }: { products: Row[] }) {
  const { data, failed, loading } = useInventory();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("");

  if (loading) return <Box>{INV.loading}</Box>;
  if (failed || !data) return <Box>{INV.failed}</Box>;
  if (!data.configured)
    return (
      <Box>
        <b className="mb-1 block text-base text-ink">{INV.notConfigured}</b>
        Quản trị website cần đặt <code>INVENTORY_SHEET_ID</code> và tài khoản dịch vụ Google (xem README, mục Tồn kho).
      </Box>
    );

  const statusOf = (slug: string): StockStatus | "none" => {
    const it = data.items[slug];
    return it ? stockStatus(it.qty, data.lowThreshold) : "none";
  };
  const searched = products.filter((p) => matchesAll(q, `${p.model} ${p.name} ${p.seriesName}`));
  const rows = searched.filter((p) => !filter || statusOf(p.slug) === filter);
  const count = (f: Filter) => searched.filter((p) => !f || statusOf(p.slug) === f).length;
  const pills: { v: Filter; l: string }[] = [
    { v: "", l: T.all },
    { v: "ok", l: INV.status.ok },
    { v: "low", l: `${INV.status.low} (≤ ${data.lowThreshold})` },
    { v: "out", l: INV.status.out },
    { v: "none", l: "Chưa có số liệu" },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3.5 text-[14px] text-ink-2">
        <span className="min-w-0">
          <RefreshCw className="mr-2 inline size-4 align-[-3px] text-muted" aria-hidden />
          {data.updatedAt ? <>File cập nhật lúc <b className="tabular-nums">{vnDateTime(data.updatedAt)}</b></> : "Chưa đọc được file"}
          {data.checkedAt && <span className="text-muted">· kiểm tra {vnDateTime(data.checkedAt).slice(0, 5)}</span>}
        </span>
        {data.sheetUrl && (
          <a className="btn btn-ghost btn-sm" href={data.sheetUrl} target="_blank" rel="noopener"><ExternalLink /> Mở file tồn kho</a>
        )}
      </div>
      {(data.stale || (data.error && !Object.keys(data.items).length)) && (
        <p role="alert" className="mb-5 flex gap-2 rounded-2xl bg-brand-gold-50 px-4 py-3 text-[14px] text-brand-gold-700">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{data.stale ? INV.stale : "Không đọc được file tồn kho"}{data.error ? `: ${data.error}` : ""}</span>
        </p>
      )}

      <div className="mb-5 grid grid-cols-[minmax(0,1fr)] gap-3.5">
        <label className="flex h-12 items-center gap-2.5 rounded-full border border-line bg-white px-4 transition focus-within:border-ink">
          <Search className="size-[17px] text-muted" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Lọc theo model, tên, dòng…" aria-label="Lọc tồn kho" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
        </label>
        <div className="flex flex-wrap gap-2">
          {pills.map((o) => (
            <button key={o.v || "all"} type="button" className="pill" aria-pressed={filter === o.v} onClick={() => setFilter(o.v)}>
              {o.l} <span className="count">{count(o.v)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: bảng; mobile: mỗi model một thẻ */}
      <div className="overflow-hidden rounded-xl2 border border-line bg-white">
        <div className="hidden grid-cols-[minmax(150px,1.1fr)_minmax(0,2fr)_120px_130px] gap-4 border-b border-line bg-surface px-4 py-3 text-[13px] font-semibold text-muted md:grid">
          <span>Model</span><span>Tên / dòng</span><span className="text-right">Tồn kho</span><span>Trạng thái</span>
        </div>
        {rows.map((p) => {
          const it = data.items[p.slug];
          const st = statusOf(p.slug);
          return (
            <div key={p.slug} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-line px-4 py-3.5 last:border-b-0 md:grid-cols-[minmax(150px,1.1fr)_minmax(0,2fr)_120px_130px] md:items-center">
              <Link href={`/san-pham/${p.slug}`} className="text-[15px] font-semibold tabular-nums text-ink hover:text-brand-navy">{p.model}</Link>
              <span className="col-start-1 row-start-2 min-w-0 text-[14px] text-muted md:col-start-auto md:row-start-auto">
                {p.name} · {p.seriesName}
                {it && it.warehouses.length > 1 && <span className="block text-[13px]">{it.warehouses.map((w) => `${w.name}: ${w.qty.toLocaleString("vi-VN")}`).join(" · ")}</span>}
                {it?.notes.length ? <span className="block text-[13px]">{it.notes.join(" · ")}</span> : null}
              </span>
              <span className="col-start-2 row-start-1 text-right text-[18px] font-bold tabular-nums md:col-start-auto md:row-start-auto">{it ? it.qty.toLocaleString("vi-VN") : T.missing}</span>
              <span className="col-start-2 row-start-2 justify-self-end md:col-start-auto md:row-start-auto md:justify-self-start">
                {st === "none" ? <span className="tag">Chưa có số liệu</span> : <span className={`tag ${STATUS_CLS[st]}`}>{INV.status[st]}</span>}
              </span>
            </div>
          );
        })}
        {!rows.length && <div className="px-4 py-10 text-center text-muted">Không có model phù hợp.</div>}
      </div>

      {data.unmatched.length > 0 && (
        <section className="mt-9">
          <h2 className="mb-1.5 text-lg font-bold">Model trong file không khớp sản phẩm nào ({data.unmatched.length})</h2>
          <p className="mb-3 text-[14px] text-muted">Kiểm tra lại cách ghi model trong file tồn kho (so khớp không phân biệt hoa thường, bỏ dấu cách và gạch nối).</p>
          <div className="flex flex-wrap gap-2">
            {data.unmatched.map((u) => <span key={u.model} className="tag tabular-nums">{u.model}: {u.qty.toLocaleString("vi-VN")}</span>)}
          </div>
        </section>
      )}
      {data.warnings.length > 0 && (
        <section className="mt-7">
          <h2 className="mb-1.5 text-lg font-bold">Dòng không đọc được số lượng</h2>
          <ul className="list-disc pl-5 text-[14px] text-muted">{data.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
        </section>
      )}
    </>
  );
}

function Box({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl2 border border-dashed border-line-2 px-5 py-14 text-center text-muted">{children}</div>;
}
