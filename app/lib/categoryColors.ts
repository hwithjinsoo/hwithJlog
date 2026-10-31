// 게시판(category)별 대표 색. CTF 하위(web/system/forensics)는 Write-Up 색 하나로 통일.
// 사이드바(PostTimeline) 점·라벨 색을 여기 한 곳에서 관리한다.
// 사이드바 카드 라벨(web, auth 등) 색. 게시판 구분 없이 모래색 하나로 통일.
// (게시판별로 다시 나누고 싶으면 여기 값만 바꾸면 됨)
// 블로그가 다크모드 전용이라 light/dark 값은 같게 둔다.
const LABEL = { light: "#C9A27E", dark: "#C9A27E" }; // 모래

export const categoryColors = {
  ctf:   LABEL, // Write-Up
  notes: LABEL, // Notes
  cve:   LABEL, // CVE
} as const;

const fallback = { light: "#8a8a8a", dark: "#9a9a9a" };

// 카테고리 + 현재 테마에 맞는 색을 돌려준다.
export function categoryColor(category: string, dark: boolean): string {
  const c = (categoryColors as Record<string, { light: string; dark: string }>)[category] ?? fallback;
  return dark ? c.dark : c.light;
}
