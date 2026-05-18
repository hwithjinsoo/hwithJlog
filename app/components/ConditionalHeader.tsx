"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isPostPage = pathname.startsWith("/posts/");

  if (isPostPage) return null;

  return <Header />;
} 