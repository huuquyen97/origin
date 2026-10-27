"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const label = (p: string) => p.split("/").pop()!.replace(/\.[a-z]+$/i, "").replace(/^(vms|ems|acp)-/, "").replace(/-/g, " ");

/** Lưới ảnh bấm để phóng to (đóng bằng Esc hoặc bấm ra ngoài). `labels` thay nhãn suy từ tên file; `contain` giữ nguyên khung ảnh có chú thích. */
export function Shots({ images, labels, contain }: { images: string[]; labels?: string[]; contain?: boolean }) {
  const [zoom, setZoom] = useState<number | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = (i: number, el: HTMLElement) => { opener.current = el; setZoom(i); };
  const name = (i: number) => labels?.[i] ?? label(images[i]);
  // Một ảnh duy nhất (thường là sơ đồ kiến trúc): hiện full chiều rộng, không cắt
  const single = images.length === 1;
  const full = single || contain || !!labels;

  useEffect(() => {
    if (zoom === null) return;
    // Focus vào nút Đóng khi mở, trả focus về ảnh đã bấm khi đóng
    closeBtn.current?.focus();
    const back = opener.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); back?.focus(); };
  }, [zoom]);

  return (
    <>
      <div className={`grid gap-2.5 ${single ? "grid-cols-1" : full ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2 lg:grid-cols-3"}`}>
        {images.map((p, i) => (
          <button key={p} type="button" onClick={(e) => open(i, e.currentTarget)} className="cursor-zoom-in overflow-hidden rounded-[14px] border border-line bg-surface text-left">
            <img src={p} alt={name(i)} loading="lazy" className={full ? "w-full bg-white" : "aspect-[16/10] w-full object-cover object-left-top"} />
            <span className={`block px-2.5 py-2 text-[12.5px] text-muted ${labels ? "" : "capitalize"}`}>{name(i)}</span>
          </button>
        ))}
      </div>
      {zoom !== null && (
        <div role="dialog" aria-modal="true" aria-label={name(zoom)} onClick={() => setZoom(null)} className="fixed inset-0 z-[110] grid cursor-zoom-out place-items-center bg-[#0a0a09]/90 p-5">
          <button ref={closeBtn} type="button" onClick={() => setZoom(null)} aria-label="Đóng" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"><X className="size-5" /></button>
          <img src={images[zoom]} alt={name(zoom)} className="max-h-[90vh] max-w-full rounded-xl bg-white" />
        </div>
      )}
    </>
  );
}
