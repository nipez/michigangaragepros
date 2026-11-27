import type { Metadata } from "next";
import { AdminFunnelClient } from "@/components/AdminFunnelClient";
import { requireAdmin } from "@/lib/admin";
import { getEnv } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin · Growth funnels",
  robots: { index: false, follow: false },
};

export default async function AdminFunnelPage() {
  let initiallyAuthed = false;
  try {
    const env = await getEnv();
    initiallyAuthed = await requireAdmin(env);
  } catch {
    initiallyAuthed = false;
  }

  return <AdminFunnelClient initiallyAuthed={initiallyAuthed} />;
}
