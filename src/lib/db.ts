import { getCloudflareContext } from "@opennextjs/cloudflare";

export type AppEnv = CloudflareEnv & {
  ADMIN_TOKEN?: string;
};

export async function getEnv(): Promise<AppEnv> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env as AppEnv;
  } catch {
    return {
      ADMIN_TOKEN: process.env.ADMIN_TOKEN,
    } as AppEnv;
  }
}

export async function getDb() {
  const env = await getEnv();
  if (!env.DB) {
    throw new Error("D1 binding DB is not configured");
  }
  return env.DB;
}
