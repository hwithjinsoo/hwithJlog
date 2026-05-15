import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          hwithJlog
        </Link>
        <nav className="flex gap-6 text-sm text-zinc-500">
           <Link href="/" className="hover:text-black transition-colors">
                Home
            </Link>
            <Link href="/#ctf" className="hover:text-black transition-colors">
                CTF
            </Link>
            <Link href="/#cs" className="hover:text-black transition-colors">
                CS
            </Link>
            <Link href="/#daily" className="hover:text-black transition-colors">
                일상
            </Link>
        </nav>
      </div>
    </header>
  );
}