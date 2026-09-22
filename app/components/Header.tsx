"use client";

import Link from "next/link";
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
        {/* 로고 (= Home) */}
        <Link
          href="/"
          aria-label="Home"
          title="Home"
          aria-current={pathname === "/" ? "page" : undefined}
          className={`flex items-center transition-opacity hover:opacity-80 ${
            pathname === "/" ? "opacity-100" : "opacity-70"
          }`}
        >
          {/* 벡터라 어떤 화면 배율에서도 선명함 */}
          <svg
            width={32}
            height={32}
            viewBox="0 0 32 32"
            role="img"
            aria-label="hwithJlog"
            className="shrink-0"
          >
            <g fill="none" strokeLinecap="butt">
              <path d="M2 29V18a14 14 0 0 1 28 0v11" stroke="#D4547A" strokeWidth={4} />
              <path d="M6.5 29V18a9.5 9.5 0 0 1 19 0v11" stroke="#E07090" strokeWidth={3} />
              <path d="M10 29V18a6 6 0 0 1 12 0v11" stroke="#E896B0" strokeWidth={2} />
            </g>
          </svg>
        </Link>

        {/* 네비 */}
        <nav className="flex items-center gap-6 text-sm flex-1">
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