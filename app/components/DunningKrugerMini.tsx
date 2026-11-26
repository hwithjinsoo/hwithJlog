// 헤더 우측(테마 버튼 옆)에 들어가는 미니 더닝-크루거 곡선.
// 우매함의 봉우리 정상에 흰 점 = 지금 내 위치.
// 반투명 톤(라이트: 검정 반투명 / 다크: 흰 반투명), 선은 두껍게 해서 반투명이 티 나게.

// 곡선 정상 좌표 (점 위치). 곡선 첫 구간이 정확히 여기서 끝나고 접선이 수평이라 정상과 일치함
const PEAK = { x: 17, y: 6 };

export default function DunningKrugerMini() {
  return (
    // translate-x-3: 헤더 오른쪽 끝에서 살짝 더 오른쪽으로
    <div className="hidden sm:flex items-center translate-x-3">
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
          r={2.6}
          fill="#ffffff"
          className="stroke-black/15 dark:stroke-transparent"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}
