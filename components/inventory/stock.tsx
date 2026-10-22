"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Boxes } from "lucide-react";
import { stockStatus, type InventoryResponse } from "@/lib/inventory/types";
import { INV, vnDateTime } from "@/lib/strings";
import { useInventory } from "./use-inventory";

const STATUS_CLS = { ok: "tag-ok", low: "tag-warn", out: "tag-danger" } as const;

/** Chuỗi ngắn cho bảng so sánh / copy: "120 (Còn hàng)" */
export function stockText(data: InventoryResponse | null, slug: string) {
  if (!data?.configured) return "";
  const it = data.items[slug];
  if (!it) return INV.none;
  return `${it.qty.toLocaleString("vi-VN")} (${INV.status[stockStatus(it.qty, data.lowThreshold)]})`;
}

/** Nhãn trên card sản phẩm; ẩn khi chưa cấu hình hoặc model không có trong file */
export function StockBadge({ slug }: { slug: string }) {
  const { data } = useInventory();
  const it = data?.configured ? data.items[slug] : undefined;
  if (!data || !it) return null;
  const st = stockStatus(it.qty, data.lowThreshold);
  return (
    <span className={`tag ${STATUS_CLS[st]} tabular-nums`} title={`${INV.title}: ${it.qty}`}>
      {st === "out" ? INV.status.out : `${INV.status[st]} · ${it.qty.toLocaleString("vi-VN")}`}
    </span>
  );
}

/** Ô tồn kho ở trang chi tiết sản phẩm */
export function StockPanel({ slug }: { slug: string }) {
  const { data, failed, loading } = useInventory();
  if (!loading && !failed && data && !data.configured) return null;
  const it = data?.items[slug];
  const st = it && data ? stockStatus(it.qty, data.lowThreshold) : null;

  return (
    <section aria-label={INV.title} className="mt-3.5 rounded-[14px] border border-line bg-white px-4 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-faint"><Boxes className="size-4" aria-hidden />{INV.title}</span>
        {st && <span className={`tag ${STATUS_CLS[st]}`}>{INV.status[st]}</span>}
      </div>
      {loading ? (
        <p className="mt-2 text-[14px] text-muted">{INV.loading}</p>
      ) : failed || !data ? (
        <p className="mt-2 text-[14px] text-muted">{INV.failed}</p>
      ) : it ? (
        <>
          <div className="mt-1.5 text-[28px] font-bold leading-tight tabular-nums">{it.qty.toLocaleString("vi-VN")}</div>
          {it.warehouses.length > 0 && (
            <ul className="mt-1.5 grid gap-1 text-[14px] text-ink-2">
              {it.warehouses.map((w) => (
                <li key={w.name} className="flex justify-between gap-3"><span>{w.name}</span><span className="tabular-nums">{w.qty.toLocaleString("vi-VN")}</span></li>
              ))}
            </ul>
          )}
          {it.notes.length > 0 && <p className="mt-1.5 text-[13.5px] text-muted">{it.notes.join(" · ")}</p>}
        </>
      ) : (
        <p className="mt-2 text-[14px] text-muted">{INV.none}</p>
      )}
      {data?.stale && (
        <p className="mt-2 flex gap-1.5 text-[13px] text-brand-gold-700"><AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />{INV.stale}</p>
      )}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2.5 text-[13px] text-muted">
        <span>{data?.updatedAt ? `${INV.updated} ${vnDateTime(data.updatedAt)}` : ""}</span>
        <Link href="/ton-kho" className="inline-flex min-h-11 items-center gap-1 font-semibold text-brand-navy md:min-h-0">{INV.viewAll} <ArrowRight className="size-3.5" /></Link>
      </div>
    </section>
  );
}
