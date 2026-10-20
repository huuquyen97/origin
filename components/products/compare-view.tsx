"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/cards";
import { norm } from "@/lib/search/normalize";
import { SPEC_GROUP_LABEL, T } from "@/lib/strings";
import { MAX_COMPARE, readCompare, writeCompare } from "./compare-store";

export type CompareProduct = {
  slug: string; model: string; name: string; series: string; seriesName: string; category: string; resolution: string;
  ipRating: string; image: string; aiFeatures: string[]; specs: Record<string, [string, string][]>;
};

const GROUP_ORDER = ["Image", "Lens", "AI", "Video", "Audio", "Network", "Storage", "Power", "Environment", "Physical", "Other"];

export function CompareView({ products, series }: { products: CompareProduct[]; series: { id: string; name: string }[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const [ids, setIds] = useState<string[]>(() => (params.get("ids") ?? "").split(",").filter((s) => bySlug.has(s)).slice(0, MAX_COMPARE));
  const [onlyDiff, setOnlyDiff] = useState(false);

  useEffect(() => {
    if (!params.get("ids")) setIds(readCompare().filter((s) => bySlug.has(s)).slice(0, MAX_COMPARE));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    writeCompare(ids);
    router.replace(ids.length ? `${pathname}?ids=${ids.join(",")}` : pathname, { scroll: false });
  }, [ids, pathname, router]);

  const ps = ids.map((s) => bySlug.get(s)!).filter(Boolean);
  type Row = { k: string; vals: string[]; diff: boolean };
  const mk = (k: string, vals: string[]): Row => ({ k, vals, diff: new Set(vals.map(norm)).size > 1 });

  const basic: Row[] = [
    mk("Dòng", ps.map((p) => p.seriesName)), mk("Loại", ps.map((p) => p.category)), mk("Độ phân giải", ps.map((p) => p.resolution)),
    mk("Chuẩn bảo vệ", ps.map((p) => p.ipRating)), mk("Tính năng AI", ps.map((p) => p.aiFeatures.join(", "))),
  ];
  const groups = [...new Set([...GROUP_ORDER, ...ps.flatMap((p) => Object.keys(p.specs))])].filter((g) => ps.some((p) => p.specs[g]));
  const rowsFor = (g: string): Row[] => {
    const labels: string[] = [];
    const seen = new Set<string>();
    ps.forEach((p) => (p.specs[g] ?? []).forEach(([k]) => { if (!seen.has(norm(k))) { seen.add(norm(k)); labels.push(k); } }));
    return labels.map((k) => mk(k, ps.map((p) => (p.specs[g] ?? []).find(([x]) => norm(x) === norm(k))?.[1] ?? "")));
  };

  const tr = (r: Row) =>
    onlyDiff && !r.diff ? null : (
      <tr key={r.k} className={r.diff ? "[&>td]:bg-[#fffbef]" : ""}>
        <th scope="row" className={`sticky left-0 z-[1] w-[200px] min-w-[150px] border-b border-line bg-white px-4 py-3 text-left align-top font-medium text-muted ${r.diff ? "shadow-[inset_3px_0_0_var(--color-brand-gold)]" : ""}`}>{r.k}</th>
        {r.vals.map((v, i) => <td key={i} className="border-b border-line px-4 py-3 align-top tabular-nums">{v || T.missing}</td>)}
      </tr>
    );

  return (
    <>
      <div className="mb-6.5 flex flex-wrap gap-2">
        <select
          value=""
          disabled={ids.length >= MAX_COMPARE}
          onChange={(e) => e.target.value && setIds((x) => [...x, e.target.value])}
          aria-label="Thêm sản phẩm"
          className="h-10 max-w-full rounded-full border border-line bg-white px-3.5 text-[13.5px] disabled:opacity-50"
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
          <div className="overflow-x-auto rounded-xl2 border border-line bg-white">
            <table className="w-full min-w-[640px] border-separate border-spacing-0 text-[13.5px]">
              <thead>
                <tr>
                  <th className="sticky left-0 z-[2] border-b border-line bg-white" />
                  {ps.map((p) => (
                    <th key={p.slug} className="border-b border-line px-4 py-3 text-left align-bottom">
                      <div className="grid min-w-[160px] gap-2">
                        {p.image && <img src={p.image} alt="" className="size-[84px] rounded-xl bg-surface object-contain p-1.5 mix-blend-multiply" />}
                        <Link className="text-[14.5px] font-semibold tabular-nums" href={`/san-pham/${p.slug}`}>{p.model}</Link>
                        <span className="text-[12.5px] font-normal text-muted">{p.name}</span>
                        <button type="button" className="pill min-h-[30px] justify-self-start" onClick={() => setIds((x) => x.filter((s) => s !== p.slug))}>Bỏ</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr><th colSpan={ps.length + 1} className="border-b border-line bg-surface px-4 py-3 text-left text-[13px] font-semibold">Tổng quan</th></tr>
                {basic.map(tr)}
                {groups.map((g) => {
                  const rows = rowsFor(g).map(tr).filter(Boolean);
                  return rows.length ? (
                    <FragmentRows key={g} title={SPEC_GROUP_LABEL[g] ?? g} span={ps.length + 1}>{rows}</FragmentRows>
                  ) : null;
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-muted">Dòng nền vàng là thông số khác nhau. Nhãn thông số được ghép theo tên ghi trên datasheet; nếu datasheet đặt tên khác nhau, thông số sẽ nằm ở hai dòng riêng.</p>
        </>
      )}
    </>
  );
}

function FragmentRows({ title, span, children }: { title: string; span: number; children: React.ReactNode }) {
  return (
    <>
      <tr><th colSpan={span} className="border-b border-line bg-surface px-4 py-3 text-left text-[13px] font-semibold">{title}</th></tr>
      {children}
    </>
  );
}
