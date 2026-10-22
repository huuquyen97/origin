"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { AUTH } from "@/lib/strings";

/** Chỉ cho quay lại đường dẫn nội bộ sau khi đăng nhập */
const safePath = (url: string | null) => {
  if (!url) return "/";
  try {
    const u = new URL(url, "http://x");
    return u.origin === "http://x" || u.origin === window.location.origin ? `${u.pathname}${u.search}${u.hash}` : "/";
  } catch {
    return "/";
  }
};

export function LoginCard() {
  const sp = useSearchParams();
  return <LoginCardView callbackUrl={safePath(sp.get("callbackUrl"))} error={sp.get("error") ?? ""} />;
}

export function LoginCardView({ callbackUrl, error }: { callbackUrl: string; error: string }) {
  const [busy, setBusy] = useState(false);
  const message = error ? AUTH.errors[error] ?? AUTH.errors.Default : "";

  return (
    <div className="grid w-full max-w-[560px] justify-items-center gap-5 text-center">
      <span className="inline-flex h-[60px] items-center rounded-full bg-white py-2 pl-3.5 pr-5">
        <Image src="/brand/mk-vision.png" alt="MK Vision" width={84} height={42} priority className="h-[42px] w-auto" />
      </span>
      <span className="eyebrow eyebrow-dark">Cổng tra cứu nội bộ - MK Vision Docs</span>
      <h1 className="heading-1">{AUTH.heading}</h1>
      <p className="text-base text-white/80">{AUTH.lead}</p>

      {message && (
        <p role="alert" className="w-full rounded-xl2 border border-white/25 bg-white/10 px-4 py-3 text-left text-[15px] text-white">
          {message}
        </p>
      )}

      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          signIn("google", { redirectTo: callbackUrl }).catch(() => setBusy(false));
        }}
        className="btn btn-light mt-1 min-h-[52px] w-full max-w-[340px] text-base disabled:opacity-70"
      >
        <GoogleMark />
        {busy ? AUTH.redirecting : AUTH.button}
      </button>
      <p className="max-w-[40ch] text-[14px] text-white/60">{AUTH.note}</p>
    </div>
  );
}

/** Logo "G" của Google theo hướng dẫn thương hiệu cho nút đăng nhập */
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="!size-5">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
      <path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
    </svg>
  );
}
