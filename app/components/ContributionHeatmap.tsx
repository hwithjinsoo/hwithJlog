"use client";

import { useState } from "react";
import { Post } from "@/app/lib/posts";

type Props = {
  posts: Post[];
};

// 표시할 연도 (여기 추가하면 드롭다운 옵션도 늘어남)
const YEARS = [2026, 2027];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// 로컬 기준 YYYY-MM-DD (toISOString의 UTC 밀림 방지)
function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function levelOf(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 2;
  if (count === 2) return 3;
  return 4;
}

export default function ContributionHeatmap({ posts }: Props) {
  const yearsWithPosts = posts.map((p) => Number(p.date.slice(0, 4)));
  const defaultYear = yearsWithPosts.length ? Math.max(...yearsWithPosts) : YEARS[0];
  const [year, setYear] = useState(YEARS.includes(defaultYear) ? defaultYear : YEARS[0]);

  // 선택 연도의 날짜별 개수
  const counts: Record<string, number> = {};
  for (const p of posts) {
    if (Number(p.date.slice(0, 4)) === year) counts[p.date] = (counts[p.date] ?? 0) + 1;
  }

  // 1/1이 속한 주의 일요일 ~ 12/31이 속한 주의 토요일까지 격자
  const start = new Date(year, 0, 1);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(year, 11, 31);
  end.setDate(end.getDate() + (6 - end.getDay()));

  type Cell = { key: string; count: number; inYear: boolean; month: number };
  const weeks: Cell[][] = [];
  const cur = new Date(start);
  while (cur <= end) {
    const week: Cell[] = [];
    for (let d = 0; d < 7; d++) {
      const key = ymd(cur);
      week.push({
        key,
        count: counts[key] ?? 0,
        inYear: cur.getFullYear() === year,
        month: cur.getMonth(),
      });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  // 월 라벨: 해당 연도의 달이 바뀌는 첫 주에 표시
  const monthLabels = weeks.map((w, i) => {
    const firstInYear = w.find((c) => c.inYear);
    if (!firstInYear) return "";
    const prevMonth = i > 0 ? (weeks[i - 1].find((c) => c.inYear)?.month ?? -1) : -1;
    return firstInYear.month !== prevMonth ? MONTHS[firstInYear.month] : "";
  });

  return (
    <div className="rounded-2xl p-6 sm:p-8 bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/60 dark:border-white/10">
      {/* 헤더: 제목 + 연도 드롭다운 */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">씩씩하고 알차고 열심히 삽니다^!</h3>
        <div className="relative">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="appearance-none cursor-pointer text-xs rounded-md border border-zinc-300 dark:border-white/15 bg-white/60 dark:bg-white/10 text-zinc-600 dark:text-zinc-200 pl-3 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-white/30"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {/* 드롭다운 화살표 */}
          <svg
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400"
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* 잔디 */}
      <div className="overflow-x-auto">
        {/* 월 라벨 */}
        <div className="flex gap-[1px] pl-[28px] mb-1.5">
          {monthLabels.map((m, i) => (
            <div key={i} className="w-[12px] text-[10px] text-zinc-400 dark:text-zinc-500 leading-none">
              {m}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* 요일 라벨 */}
          <div className="flex flex-col gap-[1px] mr-[7px] w-[21px] text-[10px] text-zinc-400 dark:text-zinc-500 leading-none">
            {["", "Mon", "", "Wed", "", "Fri", ""].map((w, i) => (
              <div key={i} className="h-[11px] flex items-center">{w}</div>
            ))}
          </div>

          {/* 격자 */}
          <div className="flex gap-[1px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[1px]">
                {week.map((cell) => (
                  <div
                    key={cell.key}
                    className={`hm-cell hm-l${levelOf(cell.count)} ${cell.inYear ? "" : "opacity-0"}`}
                    title={cell.inYear ? `${cell.key} · ${cell.count}개` : ""}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hm-cell {
          width: 11px;
          height: 11px;
          border-radius: 3px;
          display: inline-block;
          transition: transform 0.1s ease;
        }
        .hm-cell:hover { transform: scale(1.3); }
        .hm-l0 { background: #E6E1D2; }
        .hm-l1 { background: #A6E3B4; }
        .hm-l2 { background: #57C777; }
        .hm-l3 { background: #33995A; }
        .hm-l4 { background: #1E6B3C; }
        .dark .hm-l0 { background: rgba(255,255,255,0.06); }
        .dark .hm-l1 { background: #2E5A3A; }
        .dark .hm-l2 { background: #3F8B54; }
        .dark .hm-l3 { background: #56B26C; }
        .dark .hm-l4 { background: #7BD693; }
      `}</style>
    </div>
  );
}
