"use client";

import { Copy, Link2, MessageSquareText } from "lucide-react";
import { copyText } from "@/components/toast";

export function CopySpecsButton({ text }: { text: string }) {
  return (
    <button type="button" className="btn btn-ghost" onClick={() => copyText(text)}>
      <Copy /> Copy thông số
    </button>
  );
}

/** Bản rút gọn để gửi nhanh qua Zalo / chat, kèm link trang sản phẩm */
export function CopyShortButton({ text }: { text: string }) {
  return (
    <button type="button" className="btn btn-ghost" onClick={() => copyText(`${text}\n${location.href.split(/[?#]/)[0]}`, "Đã copy bản rút gọn — dán vào Zalo")}>
      <MessageSquareText /> Copy rút gọn
    </button>
  );
}

export function CopyLinkButton() {
  return (
    <button type="button" className="btn btn-ghost w-11 px-0" aria-label="Copy link" onClick={() => copyText(location.href)}>
      <Link2 />
    </button>
  );
}
