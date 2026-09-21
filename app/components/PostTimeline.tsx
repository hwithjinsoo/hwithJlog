"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Post } from "@/app/lib/posts";
import { categoryColor } from "@/app/lib/categoryColors";

// 화면에 한 번에 보여줄 카드 수 (이 이상은 내부 스크롤)
const VISIBLE = 5;
// 위/아래 가장자리 페이드 길이(px)
const FADE = 56;

type Props = {
  posts: Post[];
};

export default function PostTimeline({ posts }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState<number | undefined>(undefined);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [dark, setDark] = useState(false);

  // <html>의 .dark 클래스 감지 (테마 토글 시 점 색 실시간 반영)
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    update();
    const mo = new MutationObserver(update);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  // 스크롤 위치에 따라 위/아래 페이드 on/off 판단
  const updateEdges = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtTop(el.scrollTop <= 1);
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
  };

  // 카드 5개 높이 + 6번째 카드 절반 정도만 열어둔다 (절반은 페이드로 반투명 힌트)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const measure = () => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
      // 5개 이하면 스크롤 필요 없음 → 높이 제한/페이드 해제
      if (cards.length <= VISIBLE) {
        setMaxH(undefined);
        return;
      }
      const gap = 20; // flex gap-5 == 20px
      let h = 0;
      for (let i = 0; i < VISIBLE; i++) h += cards[i].offsetHeight;
      h += gap * VISIBLE; // 5번째 뒤 간격까지 포함
      // 6번째 카드를 절반쯤 걸쳐 보이게
      const peek = Math.round((cards[VISIBLE]?.offsetHeight ?? 90) * 0.5);
      h += peek;
      setMaxH(Math.round(h));
      requestAnimationFrame(updateEdges);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [posts]);

  // 카드가 스크롤 박스 안으로 들어올 때마다 매번 fade + slide 재생
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));

    // 모션 최소화 설정 존중
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      cards.forEach((c) => c.classList.add("tl-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("tl-in");
          else e.target.classList.remove("tl-in"); // 나갔다 다시 들어오면 재생
        });
      },
      { root, threshold: 0.35 }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [posts, maxH]);

  if (posts.length === 0) {
    return <p className="text-sm text-zinc-400">아직 작성된 글이 없습니다.</p>;
  }

  // 스크롤 가능할 때만 가장자리 페이드 적용 (위: 스크롤 내렸을 때만, 아래: 끝 아닐 때만)
  const scrollable = maxH !== undefined;
  let maskImage: string | undefined;
  if (scrollable) {
    const stops: string[] = [];
    stops.push(atTop ? "#000 0" : "transparent 0");
    if (!atTop) stops.push(`#000 ${FADE}px`);
    if (!atBottom) stops.push(`#000 calc(100% - ${FADE}px)`);
    stops.push(atBottom ? "#000 100%" : "transparent 100%");
    maskImage = `linear-gradient(to bottom, ${stops.join(", ")})`;
  }

  return (
    <div
      ref={scrollRef}
      onScroll={updateEdges}
      className="tl-scroll overflow-y-auto pr-1"
      style={{
        maxHeight: maxH ? `${maxH}px` : undefined,
        maskImage,
        WebkitMaskImage: maskImage,
      }}
    >
      {/* 안쪽 wrapper: 높이 = 전체 카드 높이 → 세로선이 카드랑 같이 스크롤됨 */}
      <div className="relative pl-5">
        {/* 세로 타임라인 선 */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-400/30" />

        <div className="flex flex-col gap-5">
          {posts.map((post) => {
            const dotColor = categoryColor(post.subcategory, dark);
            return (
              <Link
                key={post.slug.join("/")}
                href={`/posts/${post.slug.join("/")}`}
                data-card
                className="tl-card relative block group"
              >
                {/* 타임라인 점 */}
                <span
                  className="absolute -left-5 top-4 w-3 h-3 rounded-full border-2 transition-transform group-hover:scale-125 z-10"
                  style={{ backgroundColor: dotColor, borderColor: "var(--page-bg)" }}
                />
                <div className="p-4 bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-xl group-hover:bg-white/60 dark:group-hover:bg-white/10 transition-colors">
                  <p className="text-xs mb-1 font-medium" style={{ color: dotColor }}>
                    {post.subcategory}
                  </p>
                  <p className="text-sm font-medium leading-snug">{post.title}</p>
                  <p className="text-xs text-zinc-400 mt-2">{post.date}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .tl-card {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.5s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tl-card.tl-in {
          opacity: 1;
          transform: translateY(0);
        }
        /* 스크롤바 얇고 은은하게 */
        .tl-scroll::-webkit-scrollbar { width: 6px; }
        .tl-scroll::-webkit-scrollbar-thumb {
          background: rgba(161, 161, 170, 0.35);
          border-radius: 3px;
        }
        .tl-scroll::-webkit-scrollbar-track { background: transparent; }
        .tl-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(161, 161, 170, 0.35) transparent;
        }
      `}</style>
    </div>
  );
}
