# -*- coding: utf-8 -*-
import sys

path = "app/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()
orig = content

pairs = [
('''import { getAllPosts } from "./lib/posts";
import Link from "next/link";
import CTFGraph from "./components/CTFGraph";
// import RunningCat from "./components/RunningCat";
import IntroCard from "./components/IntroCard";

export default function Home() {''',
 '''import { getAllPosts } from "./lib/posts";
import Link from "next/link";
import CTFGraph from "./components/CTFGraph";
// import RunningCat from "./components/RunningCat";
import IntroCard from "./components/IntroCard";

// 그래프 라인 색이랑 맞춘 카테고리별 타임라인 점 색상
const subcategoryColor: Record<string, string> = {
  web: "#C4A882",
  system: "#8A9BAD",
  forensics: "#9AA870",
};

export default function Home() {'''),

('''        {/* 오른쪽 사이드바 */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-8">
            <h2 className="text-sm font-semibold text-zinc-500 mb-4">최근 CTF 글</h2>
            <div className="flex flex-col gap-4">
              {recentCtfPosts.length === 0 ? (
                <p className="text-sm text-zinc-400">아직 작성된 글이 없습니다.</p>
              ) : (
                recentCtfPosts.map((post) => (
                  <Link
                    key={post.slug.join("/")}
                    href={`/posts/${post.slug.join("/")}`}
                    className="block p-4 bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/60 transition-colors"
                  >
                    <p className="text-xs text-zinc-400 mb-1">{post.subcategory}</p>
                    <p className="text-sm font-medium leading-snug">{post.title}</p>
                    <p className="text-xs text-zinc-400 mt-2">{post.date}</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </aside>''',
 '''        {/* 오른쪽 사이드바 - 타임라인 형태 */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-8">
            <h2 className="text-sm font-semibold text-zinc-500 mb-4">최근 CTF 글</h2>
            {recentCtfPosts.length === 0 ? (
              <p className="text-sm text-zinc-400">아직 작성된 글이 없습니다.</p>
            ) : (
              <div className="relative pl-5">
                {/* 세로 타임라인 선 */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-400/30" />
                <div className="flex flex-col gap-5">
                  {recentCtfPosts.map((post) => {
                    const dotColor = subcategoryColor[post.subcategory] ?? "#a1a1aa";
                    return (
                      <Link
                        key={post.slug.join("/")}
                        href={`/posts/${post.slug.join("/")}`}
                        className="relative block group"
                      >
                        {/* 타임라인 점 */}
                        <span
                          className="absolute -left-5 top-4 w-3 h-3 rounded-full border-2 transition-transform group-hover:scale-125"
                          style={{ backgroundColor: dotColor, borderColor: "#EEEEDD" }}
                        />
                        <div className="p-4 bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl group-hover:bg-white/60 transition-colors">
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
            )}
          </div>
        </aside>'''),
]

errors = []
for i, (old, new) in enumerate(pairs):
    cnt = content.count(old)
    if cnt != 1:
        errors.append((i, cnt, old[:80]))
    else:
        content = content.replace(old, new, 1)

if errors:
    for e in errors:
        print("ERROR:", e)
    sys.exit(1)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("OK, changed:", content != orig)
