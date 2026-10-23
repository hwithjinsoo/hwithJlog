"use client";

import { useLayoutEffect } from "react";

// layout의 인라인 테마 스크립트는 첫 HTML 로드 때만 실행됨.
// 404처럼 React가 <html>을 클라이언트에서 다시 그리면 className이 덮어써져서 dark가 빠지는데,
// 그럴 때마다 저장된 테마(기본값 다크)를 다시 적용해서 현재 모드를 유지한다.
export default function ThemeSync() {
  useLayoutEffect(() => {
    const el = document.documentElement;
    const apply = () => {
      let dark = true;
      try {
        dark = localStorage.getItem("theme") !== "light";
      } catch {}
      if (el.classList.contains("dark") !== dark) el.classList.toggle("dark", dark);
    };

    apply();
    const mo = new MutationObserver(apply);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  return null;
}
