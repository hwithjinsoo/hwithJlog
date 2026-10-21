// 헤더 우측(테마 버튼 옆)에 들어가는 미니 더닝-크루거 곡선.
// 우매함의 봉우리 정상에 흰 점 = 지금 내 위치.
// 반투명 톤(라이트: 검정 반투명 / 다크: 흰 반투명), 선은 두껍게 해서 반투명이 티 나게.

// 곡선 정상 좌표 (점 위치). 곡선 첫 구간이 정확히 여기서 끝나고 접선이 수평이라 정상과 일치함
const PEAK = { x: 17, y: 6 };

export default function DunningKrugerMini() {
  return (
    // 기본 title 툴팁은 스타일을 못 바꿔서, 헤더 드롭다운과 같은 반투명 카드로 직접 띄운다.
    // hover뿐 아니라 키보드 포커스로도 보이게 tabIndex + focus-within 사용
    <div
      tabIndex={0}
      className="group relative hidden sm:flex items-center outline-none"
      aria-describedby="dk-tooltip"
    >
      <svg
        width={88}
        height={32}
        viewBox="0 0 100 36"
        role="img"
        aria-label="더닝 크루거 곡선, 현재 위치: 우매함의 봉우리 정상"
        className="overflow-visible"
      >
        {/* 하단 화살표 (가로축) */}
        <g className="stroke-black/20 dark:stroke-white/20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M3 33 H95" />
          <path d="M90 29.5 L95.5 33 L90 36.5" />
        </g>

        {/* 곡선: 급상승 → 봉우리 → 계곡 → 완만한 상승 */}
        <path
          d={`M4 29 C10 29 11 ${PEAK.y} ${PEAK.x} ${PEAK.y} C23 ${PEAK.y} 26 26 37 26.5 C52 27 72 18 94 9`}
          fill="none"
          className="stroke-black/20 dark:stroke-white/20"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 현재 위치 점 (라이트 모드 베이지 배경에서도 보이게 아주 옅은 외곽선) */}
        <circle
          cx={PEAK.x}
          cy={PEAK.y}
          r={3.6}
          fill="#ffffff"
          className="stroke-black/15 dark:stroke-transparent"
          strokeWidth={1}
        />
      </svg>

      {/* 커스텀 툴팁: 그래프 아래, 화면 밖으로 안 나가게 오른쪽 끝 기준 정렬 */}
      <div
        id="dk-tooltip"
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full mt-1.5 z-20 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] leading-tight
          bg-white/40 dark:bg-zinc-800/80 backdrop-blur-sm border border-white/40 dark:border-white/10
          text-zinc-600 dark:text-zinc-300 shadow-sm
          opacity-0 translate-y-1 transition-all duration-150
          group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0"
      >
        우매함의 봉우리 — ( 여기라도 가보자 )
      </div>
    </div>
  );
}
