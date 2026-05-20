import { getAllPosts } from "./lib/posts";
import Link from "next/link";
import CTFGraph from "./components/CTFGraph";
import RunningCat from "./components/RunningCat";
import IntroCard from "./components/IntroCard";

export default function Home() {
  const posts = getAllPosts();
  const recentCtfPosts = posts.filter((post) => post.category === "ctf").slice(0, 5);
  const ctfPosts = posts.filter((post) => post.category === "ctf");

  return (
    <>
     <div className="max-w-6xl mx-auto px-8 pt-12 flex gap-12 pb-32 items-start">
        {/* 왼쪽 메인 */}
        <div className="flex-1 min-w-0 flex-col gap-12">
          {/* 그래프 영역 */}
          <div className="mb-12">
            <CTFGraph posts={ctfPosts} />
            <IntroCard />
            </div>
            
          <div>
          </div>
        </div>

        {/* 오른쪽 사이드바 */}
        <aside className="w-72 shrink-0">
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
                    className="block p-4 bg-white rounded-xl border border-zinc-200 hover:border-zinc-400 transition-colors"
                  >
                    <p className="text-xs text-zinc-400 mb-1">{post.subcategory}</p>
                    <p className="text-sm font-medium leading-snug">{post.title}</p>
                    <p className="text-xs text-zinc-400 mt-2">{post.date}</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* 하단 고양이 - 페이지 전체 하단 고정 */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <RunningCat />
      </div>
    </>
  );
}