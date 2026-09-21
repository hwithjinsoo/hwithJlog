# -*- coding: utf-8 -*-
import sys
path = "app/globals.css"
with open(path, encoding="utf-8") as f:
    c = f.read()
orig = c

# 1) 다크 variant + 테마 변수
old1 = '''@import "tailwindcss";
@plugin "@tailwindcss/typography";

:root {
  --background: #ffffff;
  --foreground: #171717;
}'''
new1 = '''@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* 클래스 기반 다크모드: <html class="dark"> 일 때 dark: 유틸 활성화 */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #ffffff;
  --foreground: #171717;
  --page-bg: #EEEEDD;    /* 페이지 배경색 (타임라인 점 테두리 등에서 참조) */
}

.dark {
  --background: #1b1a17;
  --foreground: #e7e5e4; /* 따뜻한 밝은 회색 */
  --page-bg: #1b1a17;
}'''

# 2) 다크에서 prose h2(갈색 헤딩) 밝게
old2 = '''.prose h2,
.prose h2::before {
  color: #A06B3A;
}'''
new2 = '''.prose h2,
.prose h2::before {
  color: #A06B3A;
}

.dark .prose h2,
.dark .prose h2::before {
  color: #d8a878;
}'''

for old, new in [(old1, new1), (old2, new2)]:
    if c.count(old) != 1:
        print("NO MATCH:", c.count(old), repr(old[:40])); sys.exit(1)
    c = c.replace(old, new, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("globals OK", c != orig)
