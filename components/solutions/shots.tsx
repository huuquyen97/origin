"use client";

import { useState } from "react";

const label = (p: string) => p.split("/").pop()!.replace(/\.[a-z]+$/i, "").replace(/^(vms|ems|acp)-/, "").replace(/-/g, " ");

export function Shots({ images }: { images: string[] }) {
  const [zoom, setZoom] = useState<string | null>(null);
  // Một ảnh duy nhất (thường là sơ đồ kiến trúc): hiện full chiều rộng, không cắt
  const single = images.length === 1;
  return (
    <>
      <div className={`grid gap-2.5 ${single ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"}`}>
        {images.map((p) => (
          <button key={p} type="button" onClick={() => setZoom(p)} className="cursor-zoom-in overflow-hidden rounded-[14px] border border-line bg-surface text-left">
            <img src={p} alt={label(p)} loading="lazy" className={single ? "w-full" : "aspect-[16/10] w-full object-cover object-left-top"} />
            <span className="block px-2.5 py-2 text-[12.5px] capitalize text-muted">{label(p)}</span>
          </button>
        ))}
      </div>
      {zoom && (
        <div role="dialog" aria-modal="true" aria-label={label(zoom)} onClick={() => setZoom(null)} className="fixed inset-0 z-[110] grid cursor-zoom-out place-items-center bg-[#0a0a09]/90 p-5">
          <img src={zoom} alt={label(zoom)} className="max-h-[90vh] max-w-full rounded-xl" />
        </div>
      )}
    </>
  );
}
