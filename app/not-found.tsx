import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-8 pt-24 pb-24">
      <h1 className="text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
        ← 홈으로
      </Link>
    </div>
  );
}
