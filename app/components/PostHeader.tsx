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
    const headings = document.querySelectorAll("h2, h3");

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
    <div className="fixed top-0 left-0 w-full bg-white border-b border-zinc-200 z-50 px-8 py-4">
    <div className="max-w-5xl mx-auto flex items-center justify-between text-sm">
        <div className="w-8" />
        <div className="flex items-center gap-2">
        <span className="font-semibold text-black">{title}</span>
        {currentSection && (
            <>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-500">{currentSection}</span>
            </>
        )}
        </div>
        <button
        onClick={() => router.back()}
        className="text-zinc-400 hover:text-black transition-colors text-lg font-light"
        >
        ✕
        </button>
    </div>
    </div>
  );
}