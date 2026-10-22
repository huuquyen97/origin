import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ChromeGate } from "@/components/auth/chrome-gate";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SearchDialog } from "@/components/search-dialog";
import { Toaster } from "@/components/toast";
import { getHome } from "@/lib/data";
import { T } from "@/lib/strings";
import "./globals.css";

const openSans = Open_Sans({ subsets: ["latin", "vietnamese"], variable: "--font-open-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: T.siteName, template: `%s · MK Vision` },
  description: T.siteDescription,
  icons: { icon: "/brand/mk-vision.png" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={openSans.variable}>
      <body>
        {/* Phiên đăng nhập lấy phía client (/api/auth/session) để các trang vẫn sinh tĩnh */}
        <SessionProvider>
          <ChromeGate><SiteHeader /></ChromeGate>
          {children}
          <ChromeGate><SiteFooter /></ChromeGate>
          <SearchDialog suggestions={getHome().searchSuggestions} />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
