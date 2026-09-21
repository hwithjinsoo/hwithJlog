import { getAllPosts } from "./lib/posts";
import CTFGraph from "./components/CTFGraph";
// import RunningCat from "./components/RunningCat";
import IntroCard from "./components/IntroCard";
import PostTimeline from "./components/PostTimeline";

export default function Home() {
  const posts = getAllPosts();
  const ctfPosts = posts.filter((post) => post.category === "ctf");

  return (
    <>
    <div className="max-w-6xl mx-auto px-8 pt-12 flex flex-col lg:flex-row gap-12 pb-32 items-start">
      {/* 왼쪽 메인 */}
      <div className="w-full lg:flex-1 min-w-0 flex-col gap-6">
        <div className="mb-6">
          <CTFGraph posts={ctfPosts} />
          <div className="mt-6"></div>
          <IntroCard />
        </div>
          <div>
          </div>
        </div>

        {/* 오른쪽 사이드바 - 타임라인 형태 (5개까지 보이고 나머지는 내부 스크롤) */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-8">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-4">Write-Up</h2>
            <PostTimeline posts={ctfPosts} />
          </div>
        </aside>
      </div>

      {/* 하단 고양이 - 페이지 전체 하단 고정 
      잠시 주석처리 합니다 없는게 더 나을듯 5.22 */}
      {/* <div className="fixed bottom-0 left-0 w-full z-50">
        <RunningCat />
      </div> */}
    </>
  );
}