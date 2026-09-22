"use client";

import { useEffect, useRef, useState } from "react";

// 터미널에 순서대로 타이핑될 스크립트
// kind: "cmd" = 프롬프트 뒤에 명령어 타이핑 / "out" = 출력 라인
type Step = { kind: "cmd" | "out"; text: string; href?: string };

const PROMPT = "root@writeup.log ~ %";

const SCRIPT: Step[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: "열심히 살아가는 학생이에요" },
  { kind: "cmd", text: "cat github.txt" },
  { kind: "out", text: "https://github.com/hwithjinsoo", href: "https://github.com/hwithjinsoo" },
  { kind: "cmd", text: "cat about.md" },
  { kind: "out", text: "CTF·워게임의 write up을 올리는 블로그에요" },
  { kind: "out", text: "주로 web · system 해킹을 다뤄요" },
  { kind: "cmd", text: "cat whyrano.txt" },
  { kind: "out", text: "보안 세상은 깊고 공부는 끝이 없다 .." },
];

type Rendered = { kind: "cmd" | "out"; text: string; href?: string };

export default function IntroTerminal() {
  const [rendered, setRendered] = useState<Rendered[]>([]);
  const [doneAll, setDoneAll] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRendered(SCRIPT.map((s) => ({ ...s })));
      setDoneAll(true);
      return;
    }

    let cancelled = false;
    const finished: Rendered[] = [];
    let si = 0;
    let ci = 0;

    const tick = () => {
      if (cancelled) return;
      if (si >= SCRIPT.length) {
        setDoneAll(true);
        return;
      }
      const step = SCRIPT[si];
      ci += 1;
      const partial = step.text.slice(0, ci);
      // 타이핑 중에는 링크로 만들지 않고, 라인이 끝났을 때만 href를 붙인다
      setRendered([...finished, { kind: step.kind, text: partial }]);

      if (ci >= step.text.length) {
        finished.push({ kind: step.kind, text: step.text, href: step.href });
        // 완성된 라인은 href가 붙은 finished 기준으로 다시 렌더해야 링크가 생긴다.
        // (이걸 빼면 마지막 줄은 href 없는 partial 객체 상태로 남는다)
        setRendered([...finished]);
        si += 1;
        ci = 0;
        // 라인 끝난 뒤 잠깐 멈춤 (명령어면 조금 더 길게)
        timer.current = setTimeout(tick, step.kind === "cmd" ? 380 : 240);
      } else {
        // 글자당 타이핑 속도 (명령어는 또박또박, 출력은 빠르게)
        timer.current = setTimeout(tick, step.kind === "cmd" ? 55 : 18);
      }
    };

    timer.current = setTimeout(tick, 450);
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const lastIdx = rendered.length - 1;

  return (
    <div className="rounded-2xl overflow-hidden border border-white/60 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-sm min-h-[320px] flex flex-col">
      {/* 타이틀바 */}
      <div className="term-bar flex items-center gap-2 px-4 h-9 border-b border-white/10">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-3 text-[11px] text-zinc-400 font-mono select-none">root — zsh</span>
      </div>

      {/* 본문 */}
      <div className="flex-1 p-5 sm:p-6 font-mono text-[13px] sm:text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
        {rendered.map((l, i) => {
          const isLast = i === lastIdx;
          const cursor = isLast && !doneAll ? <span className="term-cursor" /> : null;
          if (l.kind === "cmd") {
            return (
              <div key={i} className="whitespace-pre-wrap break-words">
                <span className="term-prompt">{PROMPT}</span>{" "}
                <span className="term-cmd">{l.text}</span>
                {cursor}
              </div>
            );
          }
          return (
            <div key={i} className="whitespace-pre-wrap break-words term-out pl-1">
              {l.href ? (
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="term-link"
                >
                  {l.text}
                </a>
              ) : (
                l.text
              )}
              {cursor}
            </div>
          );
        })}

        {/* 마지막: 빈 프롬프트 + 깜빡이는 커서 */}
        {doneAll && (
          <div className="whitespace-pre-wrap break-words mt-0.5">
            <span className="term-prompt">{PROMPT}</span>{" "}
            <span className="term-cursor" />
          </div>
        )}
      </div>

      <style>{`
        /* 상태바 반투명(사용자가 조정하는 부분) */
        .term-bar  { background: rgba(91, 88, 85, 0.85); }
        .dark .term-bar  { background: rgba(91, 88, 85, 0.85); }
        /* 본문 글자색: 라이트=어두운 글자(라이트 터미널), 다크=밝은 글자 */
        .term-prompt { color: #1E6B3C; }
        .dark .term-prompt { color: #7BD693; }
        .term-cmd { color: #27241f; }
        .dark .term-cmd { color: #f4f4f5; }
        .term-out { color: #6f6a5e; }
        .dark .term-out { color: #a1a1aa; }
        /* 링크: 글자색은 본문(term-out) 그대로 상속, 밑줄만 추가 */
        .term-link {
          color: inherit;
          cursor: pointer;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
          text-decoration-color: currentColor;
          opacity: 0.85;
          transition: opacity 0.15s ease;
        }
        .term-link:hover { opacity: 1; }
        .term-cursor {
          display: inline-block;
          width: 8px;
          height: 1.05em;
          transform: translateY(2px);
          margin-left: 1px;
          background: #3a362e;
          animation: term-blink 1s steps(1) infinite;
        }
        .dark .term-cursor { background: #d4d4d4; }
        @keyframes term-blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
