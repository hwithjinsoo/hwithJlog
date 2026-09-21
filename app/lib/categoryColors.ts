// 카테고리(subcategory)별 대표 색.
// 그래프(CTFGraph)와 사이드바(PostTimeline)가 항상 같은 색을 쓰도록 여기 한 곳에서 관리한다.
// 무드보드(버건디/러스트/슬레이트) 기반. 원본은 너무 어두워 라인/점으로 안 보이므로
// 무드는 유지하되 라이트/다크 배경에서 보이도록 밝기·채도를 테마별로 조정.
export const categoryColors = {
  web:       { light: "#A83A52", dark: "#D66E86" }, // 와인 / 버건디
  system:    { light: "#3F6E97", dark: "#86A8CB" }, // 슬레이트 블루
  forensics: { light: "#BE6420", dark: "#DE9A4E" }, // 러스트 / 번트 오렌지
} as const;

const fallback = { light: "#8a8a8a", dark: "#9a9a9a" };

// 카테고리 + 현재 테마에 맞는 색을 돌려준다.
export function categoryColor(sub: string, dark: boolean): string {
  const c = (categoryColors as Record<string, { light: string; dark: string }>)[sub] ?? fallback;
  return dark ? c.dark : c.light;
}
