# -*- coding: utf-8 -*-
import sys
path = "app/layout.tsx"
with open(path, encoding="utf-8") as f:
    c = f.read()
orig = c

old = '''  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full">
        <BlobBackground />
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );'''

new = '''  // 새로고침 시 흰 화면 번쩍(FOUC) 방지: 페인트 전에 저장된 테마(또는 OS 설정)를 먼저 적용
  const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

  return (
    <html lang="ko" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <BlobBackground />
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );'''

if c.count(old) != 1:
    print("NO MATCH", c.count(old)); sys.exit(1)
c = c.replace(old, new, 1)
with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("layout OK", c != orig)
