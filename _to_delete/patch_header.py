# -*- coding: utf-8 -*-
import sys
path = "app/components/Header.tsx"
with open(path, encoding="utf-8") as f:
    c = f.read()
orig = c

subs = [
# import ThemeToggle
('''import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";''',
'''import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";'''),

# navClass 다크 대응
('''        ? "text-black font-semibold border-b-2 border-black"
        : "text-zinc-400 hover:text-zinc-600"''',
'''        ? "text-black dark:text-white font-semibold border-b-2 border-black dark:border-white"
        : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"'''),

# 로고 텍스트
('<span className="text-base text-zinc-500 ">write-up-log</span>',
 '<span className="text-base text-zinc-500 dark:text-zinc-300">write-up-log</span>'),

# Home 링크
('className={pathname === "/" ? "text-black font-semibold border-b-2 border-black pb-1" : "text-zinc-400 hover:text-zinc-600 pb-1 transition-colors"}',
 'className={pathname === "/" ? "text-black dark:text-white font-semibold border-b-2 border-black dark:border-white pb-1" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 pb-1 transition-colors"}'),

# CTF 드롭다운 박스
('''                className="absolute top-8 left-0 bg-white/40 backdrop-blur-sm border border-white/40 rounded-lg py-2 w-32 z-10"
                onMouseLeave={() => setCtfOpen(false)}''',
'''                className="absolute top-8 left-0 bg-white/40 dark:bg-zinc-800/80 backdrop-blur-sm border border-white/40 dark:border-white/10 rounded-lg py-2 w-32 z-10"
                onMouseLeave={() => setCtfOpen(false)}'''),

# CS 드롭다운 박스
('''                className="absolute top-8 left-0 bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg py-2 w-32 z-10"
                onMouseLeave={() => setCsOpen(false)}''',
'''                className="absolute top-8 left-0 bg-white/40 dark:bg-zinc-800/80 backdrop-blur-sm border border-white/60 dark:border-white/10 rounded-lg py-2 w-32 z-10"
                onMouseLeave={() => setCsOpen(false)}'''),

# 드롭다운 항목 hover (CTF) - 두 곳 동일하므로 replace_all
]

for old, new in subs:
    if c.count(old) != 1:
        print("NO MATCH:", c.count(old), repr(old[:45])); sys.exit(1)
    c = c.replace(old, new, 1)

# 드롭다운 아이템 hover (2곳)
item_old = 'className="block px-4 py-2 text-sm hover:bg-white/30 transition-colors"'
item_new = 'className="block px-4 py-2 text-sm hover:bg-white/30 dark:hover:bg-white/10 transition-colors"'
n = c.count(item_old)
if n < 1:
    print("NO item match"); sys.exit(1)
c = c.replace(item_old, item_new)

# 토글 버튼: nav 닫힌 뒤에 삽입
nav_close = '''          </div>

        </nav>
      </div>
    </header>'''
nav_new = '''          </div>

          {/* 다크모드 토글 */}
          <ThemeToggle />
        </nav>
      </div>
    </header>'''
if c.count(nav_close) != 1:
    print("NO nav close match", c.count(nav_close)); sys.exit(1)
c = c.replace(nav_close, nav_new, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("header OK", c != orig, "| dropdown items replaced:", n)
