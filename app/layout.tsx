import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "hwithJlog",
  description: "hwithJinsoo의 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex">
        {/* 사이드바 */}
        <aside className="w-64 min-h-screen bg-zinc-900 text-white p-4">
          <h1 className="text-xl font-bold mb-6">hwithJlog</h1>
          {/* 카테고리 트리 나중에 여기 */}
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-8 bg-zinc-50">
          {children}
        </main>
      </body>
    </html>
  );
}