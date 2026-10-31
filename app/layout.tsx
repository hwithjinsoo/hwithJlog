import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "./components/ConditionalHeader";
import BlobBackground from "./components/BlobBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "writeup.Jlog",
  description: "hwithJinsoo의 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 다크모드 전용: <html>에 dark 클래스를 고정해서 dark: 스타일이 항상 적용되게 함
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full dark`}>
      <body className="min-h-full">
        <BlobBackground />
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );
}