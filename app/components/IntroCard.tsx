"use client";

import { useEffect, useState } from "react";

export default function IntroCard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative border border-zinc-200 rounded-2xl overflow-hidden min-h-[320px] flex items-center">

      {/* 왼쪽 꽃 - Mango Mint */}
      <div
        className="absolute -left-8 pointer-events-none z-20"
        style={{
          top: "45%",
          animation: visible
            ? "spinIn 1.2s cubic-bezier(0.34,1.56,0.64,1) forwards, floatLeft 4s ease-in-out 1.2s infinite"
            : "none",
          opacity: 0,
          transformOrigin: "center",
        }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(90,90)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse key={angle} cx="0" cy="-38" rx="18" ry="32" fill="#C9A227" transform={`rotate(${angle})`} />
            ))}
            <circle cx="0" cy="0" r="22" fill="#7A5C0A" />
          </g>
        </svg>
      </div>

      {/* 오른쪽 꽃 - Party Punch */}
      <div
        className="absolute -right-10 pointer-events-none z-20"
        style={{
          top: "45%",
          animation: visible
            ? "spinIn 1.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s forwards, floatRight 3.5s ease-in-out 1.4s infinite"
            : "none",
          opacity: 0,
          transformOrigin: "center",
        }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(100,100)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse key={angle} cx="0" cy="-44" rx="20" ry="36" fill="#D4547A" transform={`rotate(${angle})`} />
            ))}
            <circle cx="0" cy="0" r="24" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* 텍스트 콘텐츠 */}
      <div className="relative z-30 w-full text-left pl-35 pr-32 pb-24 pt-10">
        <div className="flex flex-col items-center mb-4">
          <svg width="48" height="28" viewBox="0 0 48 28" xmlns="http://www.w3.org/2000/svg" className="mb-3">
            <path d="M4,24 Q4,4 24,4 Q44,4 44,24" fill="none" stroke="#D4547A" strokeWidth="4" strokeLinecap="round"/>
            <path d="M8,24 Q8,9 24,9 Q40,9 40,24" fill="none" stroke="#e07090" strokeWidth="3.5" strokeLinecap="round"/>
            <path d="M12,24 Q12,13 24,13 Q36,13 36,24" fill="none" stroke="#e896b0" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p className="text-sm mb-1" style={{ color: "#D4547A" }}>Hello, World!</p>
        </div>
        <p className="text-sm text-zinc-500 leading-relaxed mb-5 text-center">
          • 다양한 분야의 CTF 문제 풀이과정을 올릴 블로그에요
          <br />
          • 계속해서 다양한 기능이나 목록을 추가할 예정이에요
          <br />
          • next.js로 개발하고 vercel로 배포 했어요
        </p>
      </div>

      {/* 언덕 SVG */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <svg viewBox="0 0 800 130" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "130px" }}>
          <path d="M0,90 Q150,30 320,70 Q480,105 650,40 Q730,10 800,50 L800,130 L0,130 Z" fill="#a8d878"/>
          <path d="M0,110 Q100,70 250,90 Q420,115 550,75 Q680,45 800,80 L800,130 L0,130 Z" fill="#6dbf4a"/>
          <g fill="#4a9e2e">
            <path d="M60,108 Q62,95 64,108"/><path d="M64,107 Q67,93 69,107"/><path d="M68,108 Q70,97 72,108"/>
            <path d="M200,95 Q202,82 204,95"/><path d="M204,94 Q207,80 209,94"/>
            <path d="M380,107 Q382,94 384,107"/><path d="M384,106 Q387,92 389,106"/>
            <path d="M530,88 Q532,75 534,88"/><path d="M534,87 Q537,73 539,87"/>
            <path d="M700,96 Q702,83 704,96"/><path d="M704,95 Q707,81 709,95"/>
            <path d="M750,108 Q752,95 754,108"/>
          </g>
          <g>
            <circle cx="310" cy="104" r="4" fill="white"/><circle cx="310" cy="104" r="2" fill="#f5e642"/>
            <circle cx="318" cy="108" r="3.5" fill="white"/><circle cx="318" cy="108" r="1.8" fill="#f5e642"/>
            <circle cx="303" cy="109" r="3" fill="white"/><circle cx="303" cy="109" r="1.5" fill="#f5e642"/>
            <circle cx="620" cy="92" r="3.5" fill="white"/><circle cx="620" cy="92" r="1.8" fill="#f5e642"/>
            <circle cx="628" cy="96" r="3" fill="white"/><circle cx="628" cy="96" r="1.5" fill="#f5e642"/>
          </g>
        </svg>
      </div>

      {/* 애니메이션 keyframes */}
      <style>{`
        @keyframes spinIn {
          0% { transform: translateY(-50%) rotate(0deg) scale(0); opacity: 0; }
          60% { transform: translateY(-50%) rotate(340deg) scale(1.1); opacity: 1; }
          100% { transform: translateY(-50%) rotate(360deg) scale(1); opacity: 1; }
        }
        @keyframes floatLeft {
          0%, 100% { transform: translateY(-50%) rotate(0deg); }
          50% { transform: translateY(calc(-50% - 8px)) rotate(5deg); }
        }
        @keyframes floatRight {
          0%, 100% { transform: translateY(-50%) rotate(0deg); }
          50% { transform: translateY(calc(-50% - 6px)) rotate(-4deg); }
        }
      `}</style>
    </div>
  );
}
