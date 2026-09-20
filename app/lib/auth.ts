import crypto from "crypto";

export const COOKIE_NAME = "post_unlock";

export function signToken() {
  const secret = process.env.COOKIE_SECRET!;
  return crypto.createHmac("sha256", secret).update("unlocked").digest("hex");
}

export function verifyToken(token: string | undefined) {
  if (!token) return false;
  const expected = signToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
