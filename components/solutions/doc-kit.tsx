"use client";

import { Copy, Download } from "lucide-react";
import { copyText, toast } from "@/components/toast";

export type KitItem = { title: string; url: string; file: string };

/** Bộ tài liệu gửi khách: chỉ gồm tài liệu "Gửi khách được" (slide giải pháp + datasheet các model đề xuất) */
export function DocKit({ name, items, skipped }: { name: string; items: KitItem[]; skipped: number }) {
  const downloadAll = () => {
    items.forEach((d, i) =>
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = d.url;
        a.download = d.file;
        a.click();
      }, i * 450),
    );
    toast(`Đang tải ${items.length} tài liệu…`);
  };
  const copyList = () =>
    copyText(
      [`Bộ tài liệu — ${name}`, ...items.map((d, i) => `${i + 1}. ${d.title}: ${new URL(d.url, location.origin).href}`)].join("\n"),
      "Đã copy danh sách tài liệu",
    );

  return (
    <div className="rounded-xl2 bg-dark p-5 text-white">
      <h4 className="text-sm">Gửi bộ tài liệu cho khách</h4>
      <p className="mt-1.5 text-[13px] text-white/70">
        {items.length} tài liệu “Gửi khách được”: slide giải pháp và datasheet các model đề xuất.
        {skipped > 0 && ` Đã bỏ ${skipped} tài liệu nội bộ / bản cũ / hết hạn.`}
      </p>
      <ol className="mt-3 grid list-decimal gap-1 pl-5 text-[13px] text-white/85">
        {items.map((d) => <li key={d.url} className="[overflow-wrap:anywhere]">{d.title}</li>)}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-light btn-sm" onClick={downloadAll} disabled={!items.length}><Download /> Tải tất cả</button>
        <button type="button" className="btn btn-glass btn-sm" onClick={copyList} disabled={!items.length}><Copy /> Copy danh sách link</button>
      </div>
      <p className="mt-3 text-[12px] text-white/55">Trình duyệt có thể hỏi quyền tải nhiều file. Gửi khách bằng file đã tải về; danh sách link dùng để chia sẻ nội bộ.</p>
    </div>
  );
}
