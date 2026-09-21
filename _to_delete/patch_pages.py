# -*- coding: utf-8 -*-
import sys

def patch(path, subs, allow_multi=None):
    c=open(path,encoding="utf-8").read()
    orig=c
    for old,new in subs:
        n=c.count(old)
        exp=(allow_multi or {}).get(old,1)
        if n!=exp:
            print("NO MATCH in",path,":",n,"exp",exp,repr(old[:50])); sys.exit(1)
        c=c.replace(old,new)
    open(path,"w",encoding="utf-8").write(c)
    print(path,"OK",c!=orig)

# ---- 홈 h2 ----
patch("app/page.tsx", [
('<h2 className="text-sm font-semibold text-zinc-500 mb-4">CTF 글</h2>',
 '<h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-4">CTF 글</h2>'),
])

# ---- PostHeader (글 상세 상단 고정바) ----
patch("app/components/PostHeader.tsx", [
('<div className="fixed top-0 left-0 w-full bg-white border-b border-zinc-200 z-50 px-8 py-2">',
 '<div className="fixed top-0 left-0 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-50 px-8 py-2">'),
('<span className="font-semibold text-black">{title}</span>',
 '<span className="font-semibold text-black dark:text-zinc-100">{title}</span>'),
('className="text-zinc-400 hover:text-black transition-colors text-lg font-light"',
 'className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors text-lg font-light"'),
])

# ---- 글 상세 페이지 ----
patch("app/posts/[...slug]/page.tsx", [
# 비번 입력창
('className="border border-zinc-300 rounded-lg px-4 py-2"',
 'className="border border-zinc-300 dark:border-zinc-600 dark:bg-transparent rounded-lg px-4 py-2"'),
('<button type="submit" className="bg-black text-white rounded-lg py-2">',
 '<button type="submit" className="bg-black text-white dark:bg-white dark:text-black rounded-lg py-2">'),
# 카테고리 뱃지 (2개 동일)
('<span className="text-xs px-2 py-1 bg-zinc-100 rounded-full text-zinc-600">',
 '<span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-300">'),
# prose 다크
('<div className="prose prose-zinc max-w-none">',
 '<div className="prose prose-zinc dark:prose-invert max-w-none">'),
], allow_multi={'<span className="text-xs px-2 py-1 bg-zinc-100 rounded-full text-zinc-600">':2})

# ---- ctf/[sub] 목록 페이지 ----
patch("app/ctf/[sub]/page.tsx", [
('className="block p-6 bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/60 transition-colors"',
 'className="block p-6 bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors"'),
])

# ---- CategoryTabs ----
patch("app/components/CategoryTabs.tsx", [
('<div className="flex gap-4 border-b border-zinc-200 mb-8">',
 '<div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-700 mb-8">'),
('''                ? "border-b-2 border-black text-black"
                : "text-zinc-400 hover:text-zinc-600"''',
 '''                ? "border-b-2 border-black dark:border-white text-black dark:text-white"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"'''),
('className="block p-6 bg-white rounded-xl border border-zinc-200 hover:border-zinc-400 transition-colors"',
 'className="block p-6 bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/25 transition-colors"'),
('<span className="text-xs px-2 py-1 bg-zinc-100 rounded-full text-zinc-600">',
 '<span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-300">'),
], allow_multi={'<span className="text-xs px-2 py-1 bg-zinc-100 rounded-full text-zinc-600">':2})

print("ALL PAGES DONE")
