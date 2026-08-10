import { cookies } from "next/headers";
import type { AppEnv } from "./db";

export const ADMIN_COOKIE = "mgp_admin";

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export function isValidAdminToken(
  candidate: string | null | undefined,
  expected: string | undefined,
): boolean {
  if (!candidate || !expected) return false;
  return timingSafeEqual(candidate, expected);
}

export async function requireAdmin(env: AppEnv): Promise<boolean> {
  const expected = env.ADMIN_TOKEN;
  if (!expected) return false;
  const jar = await cookies();
  const cookieToken = jar.get(ADMIN_COOKIE)?.value;
  return isValidAdminToken(cookieToken, expected);
}
