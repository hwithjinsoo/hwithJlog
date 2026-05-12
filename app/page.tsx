import { getAllPosts } from "./lib/posts";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">hwithJlog</h1>
        <p className="text-zinc-500">CTF 풀이, 컴퓨터 지식, 일상을 기록합니다.</p>
      </div>

      {/* 글 목록 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug.join("/")}
            href={`/posts/${post.slug.join("/")}`}
            className="block p-6 bg-white rounded-xl border border-zinc-200 hover:border-zinc-400 transition-colors"
          >
            <div className="flex gap-2 mb-3">
              <span className="text-xs px-2 py-1 bg-zinc-100 rounded-full text-zinc-600">
                {post.category}
              </span>
              <span className="text-xs px-2 py-1 bg-zinc-100 rounded-full text-zinc-600">
                {post.subcategory}
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
            <p className="text-zinc-500 text-sm mb-4">{post.description}</p>
            <p className="text-zinc-400 text-xs">{post.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}