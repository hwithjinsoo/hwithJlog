import { getAllPosts } from "./lib/posts";
// import CTFGraph from "./components/CTFGraph"; // 원복용: 라인 그래프로 되돌리려면 이 줄과 아래 사용부를 복구
import ContributionHeatmap from "./components/ContributionHeatmap";
// import RunningCat from "./components/RunningCat";
// import IntroCard from "./components/IntroCard"; // 원복용: 꽃 인트로카드로 되돌리려면 이 줄과 아래 사용부 복구
import IntroTerminal from "./components/IntroTerminal";
import PostTimeline from "./components/PostTimeline";

export default function Home() {
  const posts = getAllPosts();
  const ctfPosts = posts.filter((post) => post.category === "ctf");
  const notesPosts = posts.filter((post) => post.category === "notes");

  // 레이아웃
  // - 넓은 화면(>=1380px): [잔디+터미널] [Write-Up] [Notes] 3단
  //   잔디 블럭은 고정 폭(약 730px)이라 메인이 그보다 좁아지면 가로 스크롤이 생김.
  //   1400px 컨테이너 기준 메인 ≈ 756px 확보되도록 사이드바 폭/간격을 맞춤.
  // - 그보다 좁으면: 메인이 위, 사이드바 두 개는 아래에 나란히(모바일은 세로)
  return (
    <>
    <div className="max-w-[1400px] mx-auto px-8 pt-12 pb-32 flex flex-col min-[1380px]:flex-row gap-10 items-start">
      {/* 왼쪽 메인 */}
      <div className="w-full min-[1380px]:flex-1 min-w-0">
        <ContributionHeatmap posts={ctfPosts} />
        <div className="mt-6"></div>
        <IntroTerminal />
      </div>

      {/* 오른쪽 사이드바 2개 - 타임라인 형태 (5개까지 보이고 나머지는 내부 스크롤) */}
      <div className="w-full min-[1380px]:w-auto shrink-0 grid grid-cols-1 md:grid-cols-2 min-[1380px]:flex gap-7 min-[1380px]:sticky min-[1380px]:top-8">
        <aside className="min-w-0 min-[1380px]:w-64">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-4">Write-Up</h2>
          <PostTimeline posts={ctfPosts} />
        </aside>
        <aside className="min-w-0 min-[1380px]:w-64">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-4">Notes</h2>
          <PostTimeline posts={notesPosts} />
        </aside>
      </div>
    </div>

      {/* 하단 고양이 - 페이지 전체 하단 고정 
      잠시 주석처리 합니다 없는게 더 나을듯 5.22 */}
      {/* <div className="fixed bottom-0 left-0 w-full z-50">
        <RunningCat />
      </div> */}
    </>
  );
}