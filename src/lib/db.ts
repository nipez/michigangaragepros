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
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
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
