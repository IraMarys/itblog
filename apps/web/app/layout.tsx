import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "IT Blog",
    template: "%s | IT Blog"
  },
  description: "Новинний IT-блог з SEO-орієнтованою архітектурою на Next.js, Express та Supabase."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="uk">
      <body>
        <div className="page-bg" />
        <SiteHeader />
        <main className="shell main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
