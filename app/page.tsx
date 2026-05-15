import { getAllPosts } from "./lib/posts";
import CategoryTabs from "./components/CategoryTabs";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();
  const recentCtfPosts = posts.filter((post) => post.category === "ctf").slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-8 pt-12 flex gap-12">
      {/* 왼쪽 메인 */}
      <div className="flex-1 min-w-0">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">hwithJlog</h1>
          <p className="text-zinc-500">CTF 풀이, 컴퓨터 지식, 일상을 기록합니다.</p>
        </div>
        <CategoryTabs posts={posts} />
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
  );
}