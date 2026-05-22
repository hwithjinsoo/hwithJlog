import { getAllPosts } from "@/app/lib/posts";
import Link from "next/link";

type Props = {
  params: Promise<{ sub: string }>;
};

export default async function DailySubPage({ params }: Props) {
  const { sub } = await params;
  const posts = getAllPosts().filter(
    (post) => post.category === "daily" && post.subcategory === sub
  );

  return (
    <div className="max-w-4xl mx-auto px-8 pt-12">
      <h1 className="text-3xl font-bold mb-2">일상 - {sub}</h1>
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