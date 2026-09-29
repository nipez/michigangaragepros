import type { Metadata } from "next";
import { AdminFeaturedClient } from "@/components/AdminFeaturedClient";
import { requireAdmin } from "@/lib/admin";
import { getEnv } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin · Featured",
  robots: { index: false, follow: false },
};

export default async function AdminFeaturedPage() {
  let initiallyAuthed = false;
  try {
    const env = await getEnv();
    initiallyAuthed = await requireAdmin(env);
  } catch {
    initiallyAuthed = false;
  }

  return <AdminFeaturedClient initiallyAuthed={initiallyAuthed} />;
}
