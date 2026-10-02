import { getAllPosts } from "@/app/lib/posts";
import Link from "next/link";

// Notes: CTF 풀이가 아닌 개념 정리 글 (CS 기초, JWT/JWK 같은 보안 개념 등)
// 하위 카테고리 없이 한 목록으로 보여주고, frontmatter의 subcategory는 태그로만 쓴다.
export default function NotesPage() {
  const posts = getAllPosts().filter((post) => post.category === "notes");

  return (
    <div className="max-w-4xl mx-auto px-8 pt-12 pb-24">
      <h1 className="text-3xl font-bold mb-2">Notes</h1>
      <p className="text-zinc-500 mb-8">{posts.length}개의 글</p>

      <div className="flex flex-col gap-4">
        {posts.length === 0 ? (
          <p className="text-zinc-400">아직 작성된 글이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug.join("/")}
              href={`/posts/${post.slug.join("/")}`}
              className="block p-6 bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/60 transition-colors"
            >
              {post.subcategory && (
                <span className="inline-block text-xs px-2 py-1 mb-3 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-300">
                  {post.subcategory}
                </span>
              )}
              <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
              <p className="text-zinc-500 text-sm mb-4">{post.description}</p>
              <p className="text-zinc-400 text-xs">{post.date}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
