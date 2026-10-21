"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle, ClipboardCopy, Download, MessageSquareText, X } from "lucide-react";
import { ProductCard } from "@/components/cards";
import { copyText } from "@/components/toast";
import { norm } from "@/lib/search/normalize";
import { SPEC_GROUP_LABEL, T } from "@/lib/strings";
import type { ProductCardData } from "@/lib/data";
import { MAX_COMPARE, readCompare, useCompare, writeCompare } from "./compare-store";

/** specs đã đổi sang nhãn hiển thị (specLabel); unconfirmed: khoá "nhóm|nhãn hiển thị" → ghi chú */
export type CompareProduct = ProductCardData & {
  aiNames: string[];
  specs: Record<string, [string, string][]>;
  unconfirmed: Record<string, string>;
};

const GROUP_ORDER = ["Image", "Lens", "AI", "Video", "Audio", "Network", "Storage", "Power", "Environment", "Physical", "Other"];

type Props = { products: CompareProduct[]; series: { id: string; name: string }[] };

/** Đọc ?ids= (link chia sẻ) hoặc ?add= (nút So sánh ở trang chi tiết); bọc trong Suspense với fallback CompareView initial={{}}. */
export function Compare(props: Props) {
  return <CompareView {...props} initial={Object.fromEntries(useSearchParams())} />;
}

export function CompareView({ products, series, initial }: Props & { initial: Record<string, string> }) {
  const router = useRouter();
  const pathname = usePathname();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const valid = (a: string[]) => [...new Set(a)].filter((s) => bySlug.has(s)).slice(0, MAX_COMPARE);
  const stored = valid(useCompare());
  // Link chia sẻ (?ids=) chỉ để xem: không ghi đè danh sách riêng cho tới khi người dùng sửa
  const [shared, setShared] = useState<string[] | null>(() => (initial.ids ? valid(initial.ids.split(",")) : null));
  const [onlyDiff, setOnlyDiff] = useState(false);
  const ids = shared ?? stored;

  useEffect(() => {
    if (!initial.add) return;
    const cur = readCompare();
    if (!cur.includes(initial.add)) writeCompare(valid([...cur, initial.add].slice(-MAX_COMPARE)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.add]);

  useEffect(() => {
    const qs = ids.length ? `?ids=${ids.join("%2C")}` : "";
    if (`${location.pathname}${location.search}` !== `${pathname}${qs}`) router.replace(`${pathname}${qs}`, { scroll: false });
  }, [ids, pathname, router]);

  const update = (next: string[]) => {
    setShared(null);
    writeCompare(valid(next));
  };

  const ps = ids.map((s) => bySlug.get(s)!).filter(Boolean);
  type Row = { k: string; vals: string[]; flags: string[]; diff: boolean };
  const mk = (k: string, vals: string[], flags: string[] = []): Row => ({ k, vals, flags, diff: new Set(vals.map(norm)).size > 1 });

  const basic: Row[] = [
    mk("Dòng", ps.map((p) => p.seriesName)),
    mk("Loại", ps.map((p) => p.categoryLabel)),
    ...[...new Set(ps.flatMap((p) => p.keySpecs.map(([l]) => l)))].map((l) => mk(l, ps.map((p) => p.keySpecs.find(([x]) => x === l)?.[1] ?? ""))),
    mk("Tính năng AI", ps.map((p) => p.aiNames.join(", "))),
  ];
  const groups = [...new Set([...GROUP_ORDER, ...ps.flatMap((p) => Object.keys(p.specs))])].filter((g) => ps.some((p) => p.specs[g]));
  const rowsFor = (g: string): Row[] => {
    const labels: string[] = [];
    ps.forEach((p) => (p.specs[g] ?? []).forEach(([k]) => labels.includes(k) || labels.push(k)));
    return labels.map((k) =>
      mk(
        k,
        ps.map((p) => (p.specs[g] ?? []).filter(([x]) => x === k).map(([, v]) => v).filter(Boolean).join(" · ")),
        ps.map((p) => p.unconfirmed[`${g}|${k}`] ?? ""),
      ),
    );
  };
  const sections: { title: string; rows: Row[] }[] = [{ title: "Tổng quan", rows: basic }, ...groups.map((g) => ({ title: SPEC_GROUP_LABEL[g] ?? g, rows: rowsFor(g) }))];

  /* ---------- Xuất ---------- */
  const cell = (s: string) => s.replace(/[\t\r\n]+/g, " ");
  const toTsv = () =>
    [["Thông số", ...ps.map((p) => p.model)], ...sections.flatMap((s) => [[`[${s.title}]`], ...s.rows.map((r) => [r.k, ...r.vals.map((v) => v || T.missing)])])]
      .map((r) => r.map(cell).join("\t"))
      .join("\n");
  const toCsv = () =>
    "﻿" +
    [["Thông số", ...ps.map((p) => p.model)], ...sections.flatMap((s) => [[`[${s.title}]`], ...s.rows.map((r) => [r.k, ...r.vals.map((v) => v || T.missing)])])]
      .map((r) => r.map((c) => `"${cell(c).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
  const toShort = () =>
    ps
      .map((p) => [`${p.model} – ${p.name}`, `• ${p.categoryLabel}`, ...p.keySpecs.filter(([, v]) => v).map(([l, v]) => `• ${l}: ${v}`), ...(p.aiNames.length ? [`• AI: ${p.aiNames.slice(0, 6).join(", ")}`] : []), `${location.origin}/san-pham/${p.slug}`].join("\n"))
      .join("\n\n");
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([toCsv()], { type: "text/csv;charset=utf-8" }));
    a.download = `so-sanh-${ps.map((p) => p.slug).join("-")}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const tr = (r: Row) =>
    onlyDiff && !r.diff ? null : (
      <tr key={r.k} className={r.diff ? "[&>td]:bg-brand-gold-50" : ""}>
        <th scope="row" className={`sticky left-0 z-[1] w-[118px] min-w-[118px] border-b border-line bg-white px-3 py-3 text-left align-top font-medium text-muted md:w-[200px] md:min-w-[170px] md:px-4 ${r.diff ? "shadow-[inset_3px_0_0_var(--color-brand-gold)]" : ""}`}>{r.k}</th>
        {r.vals.map((v, i) => (
          <td key={i} className="border-b border-line px-3 py-3 align-top tabular-nums [overflow-wrap:anywhere] md:px-4">
            {v || T.missing}
            {r.flags[i] && <span className="unconfirmed" title={r.flags[i]} aria-label={`Chưa chốt: ${r.flags[i]}`}><AlertTriangle aria-hidden /></span>}
          </td>
        ))}
      </tr>
    );

  return (
    <>
      <div className="mb-6.5 flex flex-wrap gap-2">
        <select
          value=""
          disabled={ids.length >= MAX_COMPARE}
          onChange={(e) => e.target.value && update([...ids, e.target.value])}
          aria-label="Thêm sản phẩm"
          className="h-11 max-w-full rounded-full border border-line bg-white px-3.5 text-[13.5px] disabled:opacity-50"
        >
          <option value="">+ Thêm sản phẩm ({ids.length}/{MAX_COMPARE})</option>
          {series.map((s) => {
            const opts = products.filter((p) => p.series === s.id && !ids.includes(p.slug));
            return opts.length ? (
              <optgroup key={s.id} label={s.name}>{opts.map((p) => <option key={p.slug} value={p.slug}>{p.model} — {p.name}</option>)}</optgroup>
            ) : null;
          })}
        </select>
        <button type="button" className="pill" aria-pressed={onlyDiff} onClick={() => setOnlyDiff((x) => !x)}>Chỉ hiện dòng khác nhau</button>
        {shared && <button type="button" className="pill" onClick={() => update(shared)}>Lưu vào danh sách của tôi</button>}
      </div>

      {ps.length < 2 ? (
        <>
          <div className="rounded-xl2 border border-dashed border-line-2 px-5 py-14 text-center text-muted">
            <b className="mb-1 block text-base text-ink">Chọn ít nhất 2 sản phẩm để so sánh</b>
            Dùng ô “Thêm sản phẩm” phía trên, hoặc tick “So sánh” trong <Link href="/san-pham" className="underline">danh sách sản phẩm</Link>.
          </div>
          {ps.length > 0 && <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">{ps.map((p) => <ProductCard key={p.slug} p={p} />)}</div>}
        </>
      ) : (
        <>
          <div className="mb-3.5 flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => copyText(toTsv(), "Đã copy bảng — dán vào Excel hoặc email")}><ClipboardCopy /> Copy bảng</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={download}><Download /> Tải CSV (Excel)</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => copyText(toShort(), "Đã copy bản rút gọn — dán vào Zalo")}><MessageSquareText /> Copy rút gọn (Zalo)</button>
          </div>
          <div className="overflow-x-auto rounded-xl2 border border-line bg-white">
            <table className="w-full border-separate border-spacing-0 text-[13.5px]">
              <thead>
                <tr>
                  <th className="sticky left-0 z-[2] border-b border-line bg-white" />
                  {ps.map((p) => (
                    <th key={p.slug} className="border-b border-line px-3 py-3 text-left align-bottom md:px-4">
                      <div className="grid min-w-[136px] gap-2 md:min-w-[160px]">
                        {p.image && <img src={p.image} alt="" className="size-[72px] rounded-xl bg-surface object-contain p-1.5 mix-blend-multiply md:size-[84px]" />}
                        <Link className="text-[14.5px] font-semibold tabular-nums" href={`/san-pham/${p.slug}`}>{p.model}</Link>
                        <span className="text-[12.5px] font-normal text-muted">{p.name}</span>
                        <button type="button" className="pill justify-self-start" onClick={() => update(ids.filter((s) => s !== p.slug))}><X className="size-3.5" /> Bỏ</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.map((s) => {
                  const rows = s.rows.map(tr).filter(Boolean);
                  return rows.length ? <FragmentRows key={s.title} title={s.title} span={ps.length + 1}>{rows}</FragmentRows> : null;
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-muted">
            Dòng nền vàng là thông số khác nhau. Biểu tượng <AlertTriangle className="inline size-3.5 align-[-2px] text-brand-gold-700" /> là thông số chưa chốt giữa các tài liệu — xác nhận với PM trước khi báo khách.
          </p>
        </>
      )}
    </>
  );
}

function FragmentRows({ title, span, children }: { title: string; span: number; children: React.ReactNode }) {
  return (
    <>
      <tr><th colSpan={span} className="sticky left-0 border-b border-line bg-surface px-4 py-3 text-left text-[13px] font-semibold">{title}</th></tr>
      {children}
    </>
  );
}
