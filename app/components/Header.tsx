"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

// 카테고리 헤더 추가 부분
const ctfSubcategories = ["web", "system", "forensics"];
const csSubcategories = ["architecture", "network", "os"];
const snippetSubcategories = ["web", "system"]; 

export default function Header() {
  const [ctfOpen, setCtfOpen] = useState(false);
  const [csOpen, setCsOpen] = useState(false);
  const [snippetOpen, setSnippetOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (prefix: string) => pathname.startsWith(prefix);

  const navClass = (prefix: string) =>
    `flex items-center gap-1 transition-colors pb-1 ${
      isActive(prefix)
        ? "text-black dark:text-white font-semibold border-b-2 border-black dark:border-white"
        : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
    }`;

  return (
    <header className="bg-transparent">
      <div className="max-w-5xl mx-auto px-8 py-4 flex items-center gap-8">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/plzjin.png"
            alt="hwithJlog 아이콘"
            className="rounded-full object-cover"
            width={40}
            height={30}
          />
          <span className="text-base text-zinc-500 dark:text-zinc-300">write-up-log</span>
        </Link>

        {/* 네비 */}
        <nav className="flex items-center gap-6 text-sm flex-1">
          <Link href="/" className={pathname === "/" ? "text-black dark:text-white font-semibold border-b-2 border-black dark:border-white pb-1" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 pb-1 transition-colors"}>
            Home
          </Link>

          {/* CTF 드롭다운 */}
          <div className="relative">
            <button
                onClick={() => { setCtfOpen(!ctfOpen); setCsOpen(false); setSnippetOpen(false); }}
                className={navClass("/ctf")}
              >
              CTF
              <span className="text-xs">{ctfOpen ? "▲" : "▼"}</span>
            </button>
            {ctfOpen && (
              <div 
                // 드롭다운 박스 투명도 조절
                className="absolute top-8 left-0 bg-white/40 dark:bg-zinc-800/80 backdrop-blur-sm border border-white/40 dark:border-white/10 rounded-lg py-2 w-32 z-10"
                onMouseLeave={() => setCtfOpen(false)}
              >
                {ctfSubcategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/ctf/${sub}`}
                    onClick={() => setCtfOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-white/30 dark:hover:bg-white/10 transition-colors"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* CS 드롭다운 */}
          <div className="relative">
            <button
              // CS 버튼 onClick 수정
              onClick={() => { setCsOpen(!csOpen); setCtfOpen(false); setSnippetOpen(false); }}
              className={navClass("/cs")}
            >
              CS
              <span className="text-xs">{csOpen ? "▲" : "▼"}</span>
            </button>
            {csOpen && (
              <div 
                className="absolute top-8 left-0 bg-white/40 dark:bg-zinc-800/80 backdrop-blur-sm border border-white/60 dark:border-white/10 rounded-lg py-2 w-32 z-10"
                onMouseLeave={() => setCsOpen(false)}
              >
                {csSubcategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/cs/${sub}`}
                    onClick={() => setCsOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-white/30 dark:hover:bg-white/10 transition-colors"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 다크모드 토글 */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}