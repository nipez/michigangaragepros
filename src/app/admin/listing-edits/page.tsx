import type { Metadata } from "next";
import { AdminListingEditsClient } from "@/components/AdminListingEditsClient";
import { requireAdmin } from "@/lib/admin";
import { getEnv } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin · Listing edits",
  robots: { index: false, follow: false },
};

export default async function AdminListingEditsPage() {
  let initiallyAuthed = false;
  try {
    const env = await getEnv();
    initiallyAuthed = await requireAdmin(env);
  } catch {
    initiallyAuthed = false;
  }

  return <AdminListingEditsClient initiallyAuthed={initiallyAuthed} />;
}
