import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Cloud, Cpu } from "lucide-react";
import { PageHero } from "@/components/hero";
import { Shots } from "@/components/solutions/shots";
import { getCapability } from "@/lib/data";
import { PROFILE } from "@/lib/strings";

export const metadata: Metadata = { title: "Năng lực MK Vision" };

const Src = ({ page }: { page: string }) => <p className="mt-3 text-[12.5px] text-faint">{PROFILE.short} {page}</p>;

function Mastery({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div role="meter" aria-label="Mức làm chủ" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-valuetext={`${value}%`} className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div className={`h-full rounded-full ${value >= 90 ? "bg-brand-navy" : "bg-brand-gold"}`} style={{ width: `${value}%` }} />
      </div>
      <span aria-hidden className="shrink-0 whitespace-nowrap text-right text-[12.5px] font-semibold tabular-nums text-ink-2">Làm chủ {value}%</span>
    </div>
  );
}

/** Vì sao chọn MK Vision: Edge AI, 8 công nghệ lõi, quy trình R&D, năng lực sản xuất và kiểm soát chất lượng — trích hồ sơ năng lực 2026. */
export default function CapabilityPage() {
  const c = getCapability();
  const d = c.definition;
  const m = c.manufacturing;

  return (
    <>
      <PageHero image="/img/scenes/rnd-1.jpg" crumbs={[{ label: "Năng lực" }]} eyebrow="Hồ sơ năng lực 2026" title="Năng lực MK Vision" lead={d.text} />
      <main className="container-x py-12 md:py-14">
        {/* Edge AI */}
        <section aria-labelledby="edge-h" className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
          <div>
            <span className="eyebrow">AI-on-Edge</span>
            <h2 id="edge-h" className="heading-2 mt-2">Xử lý AI ngay trên camera</h2>
            <p className="mt-3 text-ink-2">{d.direction}</p>
            <p className="note-warn mt-4 text-[14px]"><span><b>Đặc điểm nổi bật:</b> {d.highlight}</span></p>
            <h3 className="mt-6 text-base">Sản phẩm công nghệ chiến lược quốc gia, then chốt trong:</h3>
            <ul className="check-list mt-2">{d.strategic.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="rounded-xl2 bg-surface p-5 md:p-7">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="rounded-xl2 border border-line bg-white p-4">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-brand-navy"><Cpu className="size-4" aria-hidden />Edge Device</p>
                <ol className="grid gap-1.5 text-[14px]">{d.flow.edge.map((x, i) => <li key={x}><span className="text-faint">{i + 1}.</span> {x}</li>)}</ol>
              </div>
              <ArrowRight className="mx-auto size-5 rotate-90 text-muted sm:rotate-0" aria-hidden />
              <div className="rounded-xl2 border border-line bg-white p-4">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-brand-navy"><Cloud className="size-4" aria-hidden />Cloud Side</p>
                <p className="text-[14px] font-semibold">{d.flow.cloud[0]}</p>
                <p className="text-[13.5px] text-muted">→ {d.flow.cloud.slice(1).join(" · ")}</p>
              </div>
            </div>
            <p className="mt-5 text-[13.5px] text-muted">Yếu tố quyết định trong dự án camera quy mô lớn:</p>
            <div className="mt-2 flex flex-wrap gap-1.5">{d.factors.map((x) => <span key={x} className="tag tag-navy">{x}</span>)}</div>
            <Src page={d.page} />
          </div>
        </section>

        {/* Làm chủ công nghệ */}
        <section aria-labelledby="pillar-h" className="mt-16">
          <h2 id="pillar-h" className="heading-2 mb-6">Làm chủ công nghệ</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {c.pillars.items.map((p) => (
              <div key={p.name} className="image-card aspect-[3/4] p-4 md:p-5">
                <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="-z-20 object-cover" />
                <h3 className="text-base md:text-lg">{p.name}</h3>
              </div>
            ))}
          </div>
          <Src page={c.pillars.page} />
        </section>

        {/* 8 công nghệ lõi */}
        <section aria-labelledby="core-h" className="mt-16">
          <div className="section-head !mb-6">
            <h2 id="core-h" className="heading-2">{c.cores.length} công nghệ lõi</h2>
            <p className="max-w-[52ch] text-[14px] text-muted">Mức làm chủ theo từng mảng, theo hồ sơ năng lực. Các con số ở đây là năng lực chung của công ty, không phải thông số của một model cụ thể.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {c.cores.map((core) => (
              <article key={core.n} className="card p-5 md:p-6">
                <span className="eyebrow">Công nghệ lõi {core.n}</span>
                <h3 className="mt-1 text-lg">{core.name}</h3>
                <div className="mt-4 grid gap-4">
                  {core.groups.map((g) => (
                    <details key={g.name} className="group">
                      <summary className="grid min-h-11 cursor-pointer list-none gap-1.5 [&::-webkit-details-marker]:hidden">
                        <span className="flex items-center justify-between gap-2 text-[15px] font-semibold">
                          {g.name}
                          <ChevronDown className="size-4 shrink-0 text-muted transition group-open:rotate-180" aria-hidden />
                        </span>
                        {g.mastery !== undefined && <Mastery value={g.mastery} />}
                      </summary>
                      <ul className="mt-2 grid list-disc gap-1 pl-5 text-[14px] text-ink-2">{g.items.map((x) => <li key={x}>{x}</li>)}</ul>
                    </details>
                  ))}
                </div>
                <Src page={core.page} />
              </article>
            ))}
          </div>
        </section>

        {/* Quy trình R&D */}
        <section aria-labelledby="rnd-h" className="mt-16">
          <h2 id="rnd-h" className="heading-2 mb-6">Quy trình nghiên cứu phát triển camera</h2>
          <ol className="grid gap-3 md:grid-cols-5">
            {c.rnd.stages.map((s, i) => (
              <li key={s.code} className="card p-4">
                <span className="text-[13px] font-semibold text-muted">Giai đoạn {i + 1}</span>
                <h3 className="text-lg text-brand-navy">{s.code}</h3>
                {s.name && <p className="text-[12.5px] text-muted">{s.name}</p>}
                <p className="mt-2 text-[14px] font-semibold">{s.goal}</p>
                <details className="group mt-2">
                  <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 text-[13.5px] font-medium text-ink-2 md:min-h-8 [&::-webkit-details-marker]:hidden">
                    Hạng mục chính <ChevronDown className="size-4 transition group-open:rotate-180" aria-hidden />
                  </summary>
                  <ul className="mt-1 grid list-disc gap-1 pl-5 text-[13.5px] text-ink-2">{s.tasks.map((t) => <li key={t}>{t}</li>)}</ul>
                </details>
              </li>
            ))}
          </ol>
          <Src page={c.rnd.page} />
        </section>

        {/* Năng lực sản xuất */}
        <section aria-labelledby="mfg-h" className="mt-16">
          <h2 id="mfg-h" className="heading-2 mb-6">Năng lực sản xuất</h2>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div className="card p-5">
              <h3 className="mb-3 text-base">Sản xuất PCBA</h3>
              <dl className="grid gap-0 text-[14px]">
                {m.pcba.rows.map(([k, v]) => (
                  <div key={k} className="grid gap-1 border-t border-line py-2.5 first:border-t-0 sm:grid-cols-[180px_1fr] sm:gap-3">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
              <Src page={m.pcba.page} />
            </div>
            <Shots images={m.photos.map((p) => p.image)} labels={m.photos.map((p) => `${p.caption} (${p.page})`)} />
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-base">Lắp ráp, kiểm tra, đóng gói (ASM, PKG)</h3>
            <div className="hidden overflow-x-auto rounded-xl2 border border-line md:block">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-surface text-[13px] text-muted">
                  <tr>{m.assembly.headers.map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {m.assembly.rows.map((r) => (
                    <tr key={r[0]} className="border-t border-line">
                      {r.map((v, i) => <td key={i} className={`px-4 py-3 ${i === 0 ? "font-semibold" : ""} ${i >= 2 ? "tabular-nums" : ""}`}>{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="grid gap-2.5 md:hidden">
              {m.assembly.rows.map((r) => (
                <li key={r[0]} className="rounded-xl2 border border-line p-4">
                  <b className="block">{r[0]}</b>
                  <p className="mt-1 text-[13.5px] text-ink-2">{r[1]}</p>
                  <p className="mt-1.5 text-[13px] text-muted">{m.assembly.headers[2]}: {r[2]} · {m.assembly.headers[3]}: {r[3]} · {m.assembly.headers[4]}: <b className="text-ink">{r[4]}</b></p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13.5px] text-muted">{m.assembly.note}</p>
            <Src page={m.assembly.page} />
          </div>
        </section>

        {/* Phòng sạch + kiểm soát chất lượng */}
        <section aria-labelledby="qc-h" className="mt-16">
          <h2 id="qc-h" className="heading-2 mb-6">Phòng sạch và kiểm soát chất lượng</h2>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div className="grid gap-3 sm:grid-cols-2">
              {c.qc.items.map((q) => (
                <div key={q.code} className="card p-4">
                  <h3 className="text-base text-brand-navy">{q.code}</h3>
                  <ul className="mt-2 grid list-disc gap-1 pl-5 text-[13.5px] text-ink-2">{q.points.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="card overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image src={m.cleanroom.image} alt="Phòng sạch sản xuất" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
              <dl className="grid p-5 text-[14px]">
                {m.cleanroom.rows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[120px_1fr] gap-3 border-t border-line py-2 first:border-t-0">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Src page={`${c.qc.page}, ${m.cleanroom.page}`} />
        </section>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-xl2 bg-surface p-5 md:p-6">
          <p className="max-w-[60ch] text-[13.5px] text-muted">{PROFILE.source("tr.2–40")}</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/san-pham/danh-muc" className="btn btn-ghost btn-sm">Danh mục model</Link>
            <Link href="/giai-phap#kich-ban" className="btn btn-primary btn-sm">Kịch bản ứng dụng</Link>
          </div>
        </div>
      </main>
    </>
  );
}
