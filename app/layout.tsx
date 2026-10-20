import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SearchDialog } from "@/components/search-dialog";
import { Toaster } from "@/components/toast";
import { getHome } from "@/lib/data";
import { T } from "@/lib/strings";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: T.siteName, template: `%s · MK Vision` },
  description: T.siteDescription,
  icons: { icon: "/brand/mk-vision.png" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable}>
      <body>
        <div className="p-2.5 md:p-3.5">
          {children}
          <SiteFooter />
        </div>
        <SearchDialog suggestions={getHome().searchSuggestions} />
        <Toaster />
      </body>
    </html>
  );
}
