import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cookies } from "next/headers";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts } from "@/app/lib/posts";
import rehypePrettyCode from "rehype-pretty-code";
import PostHeader from "@/app/components/PostHeader";
import Image from "next/image";
import { verifyToken, COOKIE_NAME } from "@/app/lib/auth";
import { unlockPost } from "@/app/actions/unlock";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ error?: string }>;
};

// slug -> 실제 본문이 담긴 env var 키. protected 글이 늘어나면 여기에 추가.
const PROTECTED_CONTENT_ENV_MAP: Record<string, string> = {
  "ctf/web/API-Mass-Assignment(root-me)": "PROTECTED_CONTENT_API_MASS_ASSIGNMENT_B64",
};

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { error } = await searchParams;
  const filePath = path.join(process.cwd(), "app", "posts", ...slug) + ".mdx";

  if (!fs.existsSync(filePath)) {
    return (
      <div className="max-w-3xl mx-auto pt-12">
        <h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      </div>
    );
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content: stubContent } = matter(fileContents);
  let content = stubContent;

  if (data.protected) {
    const cookieStore = await cookies();
    const authorized = verifyToken(cookieStore.get(COOKIE_NAME)?.value);

    if (!authorized) {
      return (
        <div className="max-w-sm mx-auto pt-32 px-8">
          <h1 className="text-xl font-bold mb-4">비밀번호가 필요한 글이에요</h1>
          <form action={unlockPost} className="flex flex-col gap-3">
            <input type="hidden" name="redirectTo" value={`/posts/${slug.join("/")}`} />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              className="border border-zinc-300 rounded-lg px-4 py-2"
              required
            />
            <button type="submit" className="bg-black text-white rounded-lg py-2">
              확인
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">비밀번호가 틀렸어요.</p>}
        </div>
      );
    }

    // 인증 통과: 레포에 커밋된 stub 대신, 실제 본문은 env var에서 복원
    const envKey = PROTECTED_CONTENT_ENV_MAP[slug.join("/")];
    const encoded = envKey ? process.env[envKey] : undefined;
    if (encoded) {
      content = Buffer.from(encoded, "base64").toString("utf8");
    }
  }

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
          components={{
            img: (props) => (
              <Image
                src={props.src ?? ""}
                alt={props.alt ?? ""}
                width={800}
                height={500}
                style={{ width: "100%", height: "auto", borderRadius: "8px", margin: "1rem 0" }}
              />
            ),
          }}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: "github-dark",
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
