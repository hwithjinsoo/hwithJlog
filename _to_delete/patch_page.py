# -*- coding: utf-8 -*-
import sys
path = "app/page.tsx"
with open(path, encoding="utf-8") as f:
    content = f.read()
orig = content

# 1) import 추가 + 미사용 색상맵 제거 + recentCtfPosts 제거
old_head = '''import { getAllPosts } from "./lib/posts";
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

export default function Home() {
  const posts = getAllPosts();
  const recentCtfPosts = posts.filter((post) => post.category === "ctf").slice(0, 5);
  const ctfPosts = posts.filter((post) => post.category === "ctf");'''

new_head = '''import { getAllPosts } from "./lib/posts";
import CTFGraph from "./components/CTFGraph";
// import RunningCat from "./components/RunningCat";
import IntroCard from "./components/IntroCard";
import PostTimeline from "./components/PostTimeline";

export default function Home() {
  const posts = getAllPosts();
  const ctfPosts = posts.filter((post) => post.category === "ctf");'''

# 2) 사이드바 내부를 PostTimeline 컴포넌트로 교체
old_side = '''        {/* 오른쪽 사이드바 - 타임라인 형태 */}
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
        </aside>'''

new_side = '''        {/* 오른쪽 사이드바 - 타임라인 형태 (5개까지 보이고 나머지는 내부 스크롤) */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-8">
            <h2 className="text-sm font-semibold text-zinc-500 mb-4">CTF 글</h2>
            <PostTimeline posts={ctfPosts} />
          </div>
        </aside>'''

for old, new in [(old_head, new_head), (old_side, new_side)]:
    if content.count(old) != 1:
        print("NO MATCH:", content.count(old), old[:50])
        sys.exit(1)
    content = content.replace(old, new, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("OK changed:", content != orig)
