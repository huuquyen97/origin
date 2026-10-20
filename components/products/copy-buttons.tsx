"use client";

import { Copy, Link2 } from "lucide-react";
import { copyText } from "@/components/toast";

export function CopySpecsButton({ text }: { text: string }) {
  return (
    <button type="button" className="btn btn-ghost" onClick={() => copyText(text)}>
      <Copy /> Copy thông số
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
