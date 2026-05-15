"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const ctfSubcategories = ["web", "system", "forensics"];

export default function Header() {
  const [ctfOpen, setCtfOpen] = useState(false);

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
            height={30   
            }
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
              <div className="absolute top-8 left-0 bg-white border border-zinc-200 rounded-lg shadow-md py-2 w-32 z-10">
                {ctfSubcategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/?category=ctf&sub=${sub}`}
                    onClick={() => setCtfOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-zinc-50 transition-colors"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/#cs" className="hover:text-black transition-colors">
            CS
          </Link>
          <Link href="/#daily" className="hover:text-black transition-colors">
            일상
          </Link>
        </nav>
      </div>
    </header>
  );
}