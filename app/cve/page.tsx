import { getAllPosts } from "@/app/lib/posts";
import Link from "next/link";

// CVE: 공개된 취약점(CVE) 분석 글
// Notes와 같은 형태로 한 목록으로 보여주고, frontmatter의 subcategory는 태그로만 쓴다.
export default function CvePage() {
  const posts = getAllPosts().filter((post) => post.category === "cve");

  return (
    <div className="max-w-4xl mx-auto px-8 pt-12 pb-24">
      <h1 className="text-3xl font-bold mb-2">CVE</h1>
      <p className="text-zinc-500 mb-8">{posts.length}개의 글</p>

      <div className="flex flex-col gap-4">
        {posts.length === 0 ? (
          <p className="text-zinc-400">아직 작성된 글이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug.join("/")}
              href={`/posts/${post.slug.join("/")}`}
              className="block p-6 bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
            >
              {post.subcategory && (
                <p className="text-zinc-400 text-xs mb-2">#{post.subcategory}</p>
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
