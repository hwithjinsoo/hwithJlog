"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/app/lib/posts";

type Props = {
  posts: Post[];
};

const categoryLabels: Record<string, string> = {
  all: "전체",
  ctf: "CTF 풀이",
  cs: "컴퓨터 지식",
  daily: "일상",
};

export default function CategoryTabs({ posts }: Props) {
  const [selected, setSelected] = useState("all");

  const filtered =
    selected === "all"
      ? posts
      : posts.filter((post) => post.category === selected);

  return (
    <div>
      {/* 탭 */}
      <div className="flex gap-4 border-b border-zinc-200 mb-8">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={`pb-3 text-sm font-medium transition-colors ${
              selected === key
                ? "border-b-2 border-black text-black"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 글 목록 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filtered.map((post) => (
          <Link
            key={post.slug.join("/")}
            href={`/posts/${post.slug.join("/")}`}
            className="block p-6 bg-white rounded-xl border border-zinc-200 hover:border-zinc-400 transition-colors"
          >
            <div className="flex gap-2 mb-3">
              <span className="text-xs px-2 py-1 bg-zinc-100 rounded-full text-zinc-600">
                {categoryLabels[post.category] ?? post.category}
              </span>
              <span className="text-xs px-2 py-1 bg-zinc-100 rounded-full text-zinc-600">
                {post.subcategory}
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
            <p className="text-zinc-500 text-sm mb-4">{post.description}</p>
            <p className="text-zinc-400 text-xs">{post.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}