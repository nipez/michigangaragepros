import type { Metadata } from "next";
import { AdminClaimsClient } from "@/components/AdminClaimsClient";
import { requireAdmin } from "@/lib/admin";
import { getEnv } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin · Claims",
  robots: { index: false, follow: false },
};

export default async function AdminClaimsPage() {
  let initiallyAuthed = false;
  try {
    const env = await getEnv();
    initiallyAuthed = await requireAdmin(env);
  } catch {
    initiallyAuthed = false;
  }

  return <AdminClaimsClient initiallyAuthed={initiallyAuthed} />;
}
