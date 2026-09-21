"use client";

import { Post } from "@/app/lib/posts";
import { categoryColor } from "@/app/lib/categoryColors";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {
  posts: Post[];
};

export default function CTFGraph({ posts }: Props) {
  // <html>의 .dark 클래스 감지 (토글 시 실시간 반영)
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains("dark"));
    update();
    const mo = new MutationObserver(update);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  // 테마별 그래프 색
  const gridColor = dark ? "#3f3f46" : "#e4e4e7";
  const axisColor = dark ? "#a1a1aa" : "#71717a";
  const tooltipBg = dark ? "#27272a" : "#fff";
  const tooltipBorder = dark ? "#3f3f46" : "#e4e4e7";
  const tooltipLabel = dark ? "#e4e4e7" : "#000";

  // 날짜별 카테고리별 카운트
  const dailyData: Record<string, Record<string, number>> = {};

  posts.forEach((post) => {
    const date = post.date; // "2026-05-12" 형식
    if (!dailyData[date]) {
      dailyData[date] = { web: 0, system: 0, forensics: 0 };
    }
    if (post.subcategory in dailyData[date]) {
      dailyData[date][post.subcategory]++;
    }
  });

  const data = Object.entries(dailyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({
      date,
      ...counts,
    }));

  return (
    <div className="rounded-2xl p-8 bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/60 dark:border-white/10">
      {/*그래프 위치 조정*/}
      <ResponsiveContainer width="95%" height={150}>
        <LineChart data={data} margin={{ left: 12, right: 20}}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="date" stroke={axisColor} tick={{ fontSize: 10, fill: axisColor }} />
          <YAxis stroke={axisColor} tick={{ fontSize: 12, fill: axisColor }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }}
            labelStyle={{ color: tooltipLabel }}
          />
           {/*텍스트 위치 조정*/}
          <Legend wrapperStyle={{ marginTop: "40px" }}/>
          <Line type="monotone" dataKey="web" stroke={categoryColor("web", dark)} strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="system" stroke={categoryColor("system", dark)} strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="forensics" stroke={categoryColor("forensics", dark)} strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}