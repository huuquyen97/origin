"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { PROFILE, SCENE } from "@/lib/strings";

type Ref = { id: string; name: string };
export type SceneData = {
  id: string;
  name: string;
  page: string;
  image: string;
  productsImage: string;
  solution: { slug: string; name: string } | null;
  series: Ref[];
  hotspots: { label: string; box: [number, number, number, number]; features: (Ref & { count: number })[]; series: Ref | null }[];
};

/** Kịch bản ngành từ hồ sơ năng lực: ảnh minh họa có điểm nóng trùng vị trí nhãn trong ảnh, bấm để xem tính năng AI và dòng sản phẩm liên quan. */
/** Trang /giai-phap: mở sẵn kịch bản theo ?kb=<id> (link từ tìm kiếm); bọc trong <Suspense fallback={<ScenarioExplorerView … />}> */
export function ScenarioExplorer({ scenes }: { scenes: SceneData[] }) {
  const kb = useSearchParams().get("kb");
  return <ScenarioExplorerView scenes={scenes} initial={Math.max(0, scenes.findIndex((s) => s.id === kb))} />;
}

export function ScenarioExplorerView({ scenes, tabs = true, initial = 0 }: { scenes: SceneData[]; tabs?: boolean; initial?: number }) {
  const [idx, setIdx] = useState(initial);
  const [spot, setSpot] = useState<number | null>(null);
  const panel = useRef<HTMLElement>(null);
  const s = scenes[idx];
  const h = spot === null ? null : s.hotspots[spot];
  const pickScene = (i: number) => { setIdx(i); setSpot(null); };
  // Mobile: khung kết quả nằm dưới danh sách tình huống, cuộn tới để người dùng thấy thay đổi
  const pick = (i: number) => {
    setSpot(spot === i ? null : i);
    if (spot !== i && window.matchMedia("(max-width: 1023px)").matches) requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      {tabs && scenes.length > 1 && (
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label={SCENE.title}>
          {scenes.map((x, i) => (
            <button key={x.id} type="button" className="pill shrink-0" aria-pressed={i === idx} onClick={() => pickScene(i)}>{x.name}</button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:items-start">
        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-xl2 border border-line bg-white">
            <img src={s.image} alt={`Kịch bản ${s.name}`} className="block w-full" />
            {s.hotspots.map((x, i) => (
              <button
                key={x.label}
                type="button"
                aria-label={x.label}
                aria-pressed={spot === i}
                tabIndex={-1}
                onClick={() => setSpot(spot === i ? null : i)}
                className="absolute hidden rounded-md border-2 border-transparent transition-colors hover:border-brand-navy/60 hover:bg-brand-navy/5 aria-pressed:border-brand-navy aria-pressed:bg-brand-navy/10 md:block"
                style={{ left: `${x.box[0]}%`, top: `${x.box[1]}%`, width: `${x.box[2]}%`, height: `${x.box[3]}%` }}
              />
            ))}
          </div>
          {/* Danh sách tình huống: dùng được trên mobile (ảnh nhỏ, điểm nóng khó bấm) và cho bàn phím */}
          <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Tình huống trong kịch bản ${s.name}`}>
            {s.hotspots.map((x, i) => (
              <li key={x.label}>
                <button type="button" className="pill h-auto min-h-11 whitespace-normal py-2 text-left md:min-h-9" aria-pressed={spot === i} onClick={() => pick(i)}>
                  {x.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <aside ref={panel} className="card scroll-mt-24 gap-4 p-5" aria-live="polite">
          {h ? (
            <>
              <h3 className="text-lg">{h.label}</h3>
              {h.features.length > 0 ? (
                <div>
                  <p className="mb-2 text-[13px] font-semibold text-muted">{SCENE.features}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {h.features.map((f) => <Link key={f.id} href={`/thuat-toan-ai#${f.id}`} className="pill">{f.name}</Link>)}
                  </div>
                  {h.features.filter((f) => f.count > 0).map((f) => (
                    <Link key={f.id} href={`/san-pham?ai=${f.id}`} className="link-more mt-1 flex">{f.count} sản phẩm có “{f.name}” <ArrowRight aria-hidden /></Link>
                  ))}
                  {h.features.every((f) => !f.count) && <p className="mt-2 text-[13.5px] text-muted">{SCENE.noProduct}</p>}
                </div>
              ) : (
                <p className="flex gap-2 text-[14px] text-muted"><Info className="mt-0.5 size-4 shrink-0" aria-hidden />{SCENE.noFeature}</p>
              )}
              {h.series && (
                <div>
                  <p className="mb-2 text-[13px] font-semibold text-muted">{SCENE.series}</p>
                  <Link href={`/san-pham?series=${h.series.id}`} className="pill">{h.series.name}</Link>
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="text-lg">{s.name}</h3>
              <p className="text-[14px] text-muted">{SCENE.lead}</p>
            </>
          )}

          <div className="border-t border-line pt-4">
            <p className="mb-2 text-[13px] font-semibold text-muted">{SCENE.products}</p>
            <img src={s.productsImage} alt={`${SCENE.products}: ${s.name}`} className="w-full rounded-lg border border-line" />
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {s.series.map((x) => <Link key={x.id} href={`/san-pham?series=${x.id}`} className="tag tag-navy hover:underline">{x.name}</Link>)}
            </div>
          </div>
          {s.solution && tabs && (
            <Link href={`/giai-phap/${s.solution.slug}`} className="btn btn-primary btn-sm h-auto self-start whitespace-normal py-2.5 text-left">{SCENE.solution}: {s.solution.name}</Link>
          )}
          {!s.solution && <p className="note-warn"><Info className="mt-0.5 size-4 shrink-0" aria-hidden /><span>{SCENE.directional}</span></p>}
          <p className="text-[12.5px] text-faint">{PROFILE.short} {s.page}</p>
        </aside>
      </div>
    </div>
  );
}
