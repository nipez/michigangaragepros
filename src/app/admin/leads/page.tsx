import type { Metadata } from "next";
import { AdminLeadsClient } from "@/components/AdminLeadsClient";
import { requireAdmin } from "@/lib/admin";
import { getEnv } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin · Leads",
  robots: { index: false, follow: false },
};

export default async function AdminLeadsPage() {
  let initiallyAuthed = false;
  try {
    const env = await getEnv();
    initiallyAuthed = await requireAdmin(env);
  } catch {
    initiallyAuthed = false;
  }

  return <AdminLeadsClient initiallyAuthed={initiallyAuthed} />;
}
