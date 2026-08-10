import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin";
import { getEnv } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { token?: string };
  try {
    body = (await request.json()) as { token?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const env = await getEnv();
  if (!env.ADMIN_TOKEN) {
    return NextResponse.json(
      { error: "ADMIN_TOKEN is not configured on this Worker" },
      { status: 503 },
    );
  }

  if (!isValidAdminToken(body.token?.trim(), env.ADMIN_TOKEN)) {
    return NextResponse.json({ error: "Invalid admin token" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, env.ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  });
  return res;
}
