import type { Metadata, Viewport } from "next";
import { Jua } from "next/font/google";
import "./globals.css";

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "분유 세팅 가이드",
  description: "분유 제조기 세팅 번호를 빠르게 찾아보세요. 베이비브레짜, 브라비 등 주요 제조기와 국산·수입 분유 세팅 정보를 제공합니다.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "분유 세팅" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fce7f3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={jua.className}>{children}</body>
    </html>
  );
}
