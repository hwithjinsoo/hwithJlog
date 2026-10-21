"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken, COOKIE_NAME } from "@/app/lib/auth";

export async function unlockPost(formData: FormData) {
  const password = formData.get("password");
  // 오픈 리다이렉트 방지: 사이트 내부 경로(/posts/...)만 허용. "//evil.com", "/\evil.com" 같은 값은 홈으로
  const rawRedirect = formData.get("redirectTo")?.toString() ?? "/";
  const redirectTo = /^\/(?![/\\])/.test(rawRedirect) ? rawRedirect : "/";

  if (password !== process.env.BLOG_UNLOCK_PASSWORD) {
    redirect(`${redirectTo}?error=1`);
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, signToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1시간
  });

  redirect(redirectTo);
}
