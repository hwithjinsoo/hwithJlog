import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts } from "@/app/lib/posts";
import rehypePrettyCode from "rehype-pretty-code";
import PostHeader from "@/app/components/PostHeader";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "app", "posts", ...slug) + ".mdx";

  if (!fs.existsSync(filePath)) {
    return (
      <div className="max-w-3xl mx-auto pt-12">
        <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      </div>
    );
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return (
    <>
      <PostHeader title={data.title} />
    <div className="max-w-5xl mx-auto pt-20 px-8 pb-24"> {/* 본문 패딩 및 간격 조정 */}
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          <span className="text-xs px-2 py-1 bg-zinc-100 rounded-full text-zinc-600">
            {data.category}
          </span>
          <span className="text-xs px-2 py-1 bg-zinc-100 rounded-full text-zinc-600">
            {data.subcategory}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
        <p className="text-zinc-400 text-sm">{data.date}</p>
      </div>
      <div className="prose prose-zinc max-w-none">
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: "github-light",
                    showLineNumbers: true,
                  },
                ],
              ],
            },
          }}
        />
      </div>
    </div>
   </>
  );
}