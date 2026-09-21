"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
};

export default function PostHeader({ title }: Props) {
  const [currentSection, setCurrentSection] = useState("");
  const router = useRouter();

  useEffect(() => {
    const headings = document.querySelectorAll("h2, h2");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.textContent || "");
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-50 px-8 py-2">
    <div className="max-w-5xl mx-auto flex items-center justify-between text-sm">
        <div className="w-8" />
        <div className="flex items-center gap-2">
        <span className="font-semibold text-black dark:text-zinc-100">{title}</span>
        {currentSection && (
            <>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-500">{currentSection}</span>
            </>
        )}
        </div>
        <button
        onClick={() => router.back()}
        className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors text-lg font-light"
        >
        ✕
        </button>
    </div>
    </div>
  );
}