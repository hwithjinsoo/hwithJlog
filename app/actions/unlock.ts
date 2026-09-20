"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken, COOKIE_NAME } from "@/app/lib/auth";

export async function unlockPost(formData: FormData) {
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo")?.toString() ?? "/";

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
