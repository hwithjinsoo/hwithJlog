import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts } from "@/app/lib/posts";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "app", ...slug) + ".mdx";
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return (
    <div className="max-w-3xl mx-auto">
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
      <div className="prose max-w-none">
        <MDXRemote source={content} />
      </div>
    </div>
  );
}