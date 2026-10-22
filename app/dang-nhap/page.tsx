import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { LoginCard, LoginCardView } from "@/components/auth/login-card";
import { AUTH } from "@/lib/strings";

export const metadata: Metadata = { title: AUTH.title };

/** Trang đăng nhập: không có header/footer (ChromeGate), hero tối toàn màn hình theo design hiện tại. */
export default function LoginPage() {
  return (
    <main className="shade-hero relative isolate grid min-h-svh place-items-center overflow-hidden bg-dark px-4 py-12 text-white">
      <Image src="/img/scenes/hero.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <Suspense fallback={<LoginCardView callbackUrl="/" error="" />}>
        <LoginCard />
      </Suspense>
    </main>
  );
}
