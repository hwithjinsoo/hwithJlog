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
  // 월별 카테고리별 카운트
  const monthlyData: Record<string, Record<string, number>> = {};

  posts.forEach((post) => {
    const month = post.date.slice(0, 7); // "2026-05"
    if (!monthlyData[month]) {
      monthlyData[month] = { web: 0, system: 0, forensics: 0 };
    }
    if (post.subcategory in monthlyData[month]) {
      monthlyData[month][post.subcategory]++;
    }
  });

  const data = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, counts]) => ({
      month,
      ...counts,
    }));

  return (
    <div className="bg-white rounded-2xl p-8">
    <h2 className="text-lg font-semibold mb-6 text-black">CTF 풀이 현황</h2>
    <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis dataKey="month" stroke="#71717a" tick={{ fontSize: 12 }} />
        <YAxis stroke="#71717a" tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e4e4e7" }}
            labelStyle={{ color: "#000" }}
        />
        <Legend />
            <Line type="monotone" dataKey="web" stroke="#2d6a4f" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="system" stroke="#e07b5a" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="forensics" stroke="#4f86c6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
    </ResponsiveContainer>
    </div>
  );
}