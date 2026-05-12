import { getAllPosts } from "./lib/posts";
import CategoryTabs from "./components/CategoryTabs";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">hwithJlog</h1>
        <p className="text-zinc-500">CTF 풀이, 컴퓨터 지식, 일상을 기록합니다.</p>
      </div>
      <CategoryTabs posts={posts} />
    </div>
  );
}