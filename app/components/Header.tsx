"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const ctfSubcategories = ["web", "system", "forensics"];
const csSubcategories = ["architecture", "network", "os"];
const dailySubcategories = ["ex1", "ex2"];

export default function Header() {
  const [ctfOpen, setCtfOpen] = useState(false);
  const [csOpen, setCsOpen] = useState(false);
  const [dailyOpen, setDailyOpen] = useState(false);

  return (
    <header className="border-b border-zinc-200 bg-white">
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
          <span className="text-xl font-bold">hwithJlog</span>
        </Link>

        {/* 네비 */}
        <nav className="flex items-center gap-6 text-sm text-zinc-500">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>

          {/* CTF 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setCtfOpen(!ctfOpen)}
              className="flex items-center gap-1 hover:text-black transition-colors"
            >
              CTF
              <span className="text-xs">{ctfOpen ? "▲" : "▼"}</span>
            </button>
            {ctfOpen && (
              <div 
                className="absolute top-8 left-0 bg-white border border-zinc-200 rounded-lg shadow-md py-2 w-32 z-10"
                onMouseLeave={() => setCtfOpen(false)}
              >
                {ctfSubcategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/ctf/${sub}`}
                    onClick={() => setCtfOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-zinc-50 transition-colors"
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
              onClick={() => setCsOpen(!csOpen)}
              className="flex items-center gap-1 hover:text-black transition-colors"
            >
              CS
              <span className="text-xs">{csOpen ? "▲" : "▼"}</span>
            </button>
            {csOpen && (
              <div 
                className="absolute top-8 left-0 bg-white border border-zinc-200 rounded-lg shadow-md py-2 w-32 z-10"
                onMouseLeave={() => setCsOpen(false)}
              >
                {csSubcategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/cs/${sub}`}
                    onClick={() => setCsOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-zinc-50 transition-colors"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 일상 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setDailyOpen(!dailyOpen)}
              className="flex items-center gap-1 hover:text-black transition-colors"
            >
              일상
              <span className="text-xs">{dailyOpen ? "▲" : "▼"}</span>
            </button>
            {dailyOpen && (
              <div 
                className="absolute top-8 left-0 bg-white border border-zinc-200 rounded-lg shadow-md py-2 w-32 z-10"
                onMouseLeave={() => setDailyOpen(false)}
              >
                {dailySubcategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/daily/${sub}`}
                    onClick={() => setDailyOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-zinc-50 transition-colors"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}