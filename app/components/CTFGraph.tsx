"use client";

import { Post } from "@/app/lib/posts";
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
    <div className="rounded-2xl p-8 bg-white/40 backdrop-blur-sm border border-white/60">
      {/*그래프 위치 조정*/}
      <ResponsiveContainer width="95%" height={150}>
        <LineChart data={data} margin={{ left: 12, right: 20}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 10}} />
          <YAxis stroke="#71717a" tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e4e4e7" }}
            labelStyle={{ color: "#000" }}
          />
           {/*텍스트 위치 조정*/}
          <Legend wrapperStyle={{ marginTop: "40px" }}/>
          <Line type="monotone" dataKey="web" stroke="#C4A882" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="system" stroke="#8A9BAD" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="forensics" stroke="#9AA870" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}