import { getCloudflareContext } from "@opennextjs/cloudflare";

export type AppEnv = CloudflareEnv & {
  RESEND_API_KEY?: string;
  LEAD_NOTIFY_TO?: string;
  LEAD_NOTIFY_FROM?: string;
  ADMIN_TOKEN?: string;
};

export async function getEnv(): Promise<AppEnv> {
  const { env } = await getCloudflareContext({ async: true });
  return env as AppEnv;
}

export async function getDb() {
  const env = await getEnv();
  if (!env.DB) {
    throw new Error("D1 binding DB is not configured");
  }
  return env.DB;
}
