"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Post } from "@/app/lib/posts";
import { categoryColor } from "@/app/lib/categoryColors";

// 화면에 한 번에 보여줄 카드 수 기본값 (이 이상은 내부 스크롤)
const DEFAULT_VISIBLE = 5;
// 위/아래 가장자리 페이드 길이(px)
const FADE = 56;

type Props = {
  posts: Post[];
  // true면 부모 높이를 꽉 채우고 넘치는 카드는 내부 스크롤 (홈 Notes/CVE를 Write-Up 열 높이에 맞출 때)
  // md 미만(한 열로 쌓일 때)은 부모 높이가 없으니 기존처럼 카드 visible개 높이로 제한
  fill?: boolean;
  // 한 번에 보여줄 카드 수 (기본 5개, 넘치면 내부 스크롤)
  visible?: number;
};

export default function PostTimeline({ posts, fill = false, visible = DEFAULT_VISIBLE }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState<number | undefined>(undefined);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
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
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  };

  // 박스 높이가 바뀔 때(창 크기, 옆 열 높이 변화)마다 넘침/페이드 상태 다시 계산
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    // 카드 등장 애니메이션(translateY 14px) 중엔 잠깐 넘치는 것으로 계산되므로, 끝나면 다시 계산
    el.addEventListener("transitionend", updateEdges);
    return () => {
      ro.disconnect();
      el.removeEventListener("transitionend", updateEdges);
    };
  }, [posts]);

  // 카드 visible개 높이 + 그다음 카드 절반 정도만 열어둔다 (절반은 페이드로 반투명 힌트)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const measure = () => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
      // visible개 이하면 스크롤 필요 없음 → 높이 제한/페이드 해제
      if (cards.length <= visible) {
        setMaxH(undefined);
        return;
      }
      const gap = 20; // flex gap-5 == 20px
      let h = 0;
      for (let i = 0; i < visible; i++) h += cards[i].offsetHeight;
      h += gap * visible; // 마지막 보이는 카드 뒤 간격까지 포함
      // 그다음 카드를 절반쯤 걸쳐 보이게
      const peek = Math.round((cards[visible]?.offsetHeight ?? 90) * 0.5);
      h += peek;
      setMaxH(Math.round(h));
      requestAnimationFrame(updateEdges);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [posts, visible]);

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
    // 빈 상태도 카드 모양으로 둬서 옆 타임라인이랑 높이/톤이 덜 튀게
    return (
      <div className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-white/15 text-xs text-zinc-400">
        아직 작성된 글이 없습니다.
      </div>
    );
  }

  // 스크롤 가능할 때만 가장자리 페이드 적용 (위: 스크롤 내렸을 때만, 아래: 끝 아닐 때만)
  let maskImage: string | undefined;
  if (overflowing) {
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
      // pl-3 -ml-3: 점의 빛(box-shadow)이 스크롤 박스 왼쪽 경계에서 잘리지 않게 여유를 두고, 위치는 그대로
      className={`tl-scroll overflow-y-auto pr-1 pl-3 -ml-3 ${fill ? "md:h-full max-md:[max-height:var(--tl-max)]" : ""}`}
      style={{
        ...(fill
          ? ({ "--tl-max": maxH ? `${maxH}px` : "none" } as React.CSSProperties)
          : { maxHeight: maxH ? `${maxH}px` : undefined }),
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
            // 라벨은 게시판(Write-Up/Notes/CVE)별 색, 점은 모두 같은 빛나는 흰 점(.tl-dot)
            const labelColor = categoryColor(post.category, dark);
            return (
              <Link
                key={post.slug.join("/")}
                href={`/posts/${post.slug.join("/")}`}
                data-card
                className="tl-card relative block group"
              >
                {/* 타임라인 점 */}
                <span className="tl-dot absolute -left-5 top-4 m-0.5 w-2 h-2 rounded-full group-hover:scale-125 z-10" />
                <div className="p-4 bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-xl group-hover:bg-white/60 dark:group-hover:bg-white/10 transition-colors">
                  <p className="text-xs mb-1 font-medium" style={{ color: labelColor }}>
                    {post.subcategory || post.category}
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
        /* 타임라인 점: 흰색에 가까운 밝은 회색, 테두리 없이 점 가장자리에서 바로 옅어지는 은은한 빛
           (spread 0 → 점 경계에서 빛이 시작돼서 테두리처럼 보이는 경계선이 안 생김) */
        .tl-dot {
          background-color: #e7e5e4;
          box-shadow: 0 0 5px 0 rgba(231, 229, 228, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        /* 카드에 마우스를 올리면 살짝 더 밝게 */
        .group:hover .tl-dot {
          box-shadow: 0 0 7px 0 rgba(231, 229, 228, 0.5);
        }
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
