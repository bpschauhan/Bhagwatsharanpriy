import { z } from "zod";

const serverEnvSchema = z.object({
  AUTH_SECRET: z.string().min(32).optional(),
  AUTH_TRUST_HOST: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
  INITIAL_ADMIN_EMAIL: z.string().email().optional(),
  INITIAL_ADMIN_PASSWORD: z.string().min(12).optional(),
  INITIAL_ADMIN_NAME: z.string().min(1).optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = serverEnvSchema.parse({
  AUTH_SECRET: process.env.AUTH_SECRET,
  AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
  DATABASE_URL: process.env.DATABASE_URL,
  INITIAL_ADMIN_EMAIL: process.env.INITIAL_ADMIN_EMAIL,
  INITIAL_ADMIN_PASSWORD: process.env.INITIAL_ADMIN_PASSWORD,
  INITIAL_ADMIN_NAME: process.env.INITIAL_ADMIN_NAME,
  NODE_ENV: process.env.NODE_ENV,
});

export function getMissingProductionEnv() {
  const missing: string[] = [];

  if (!env.AUTH_SECRET) {
    missing.push("AUTH_SECRET");
  }

  if (!env.DATABASE_URL) {
    missing.push("DATABASE_URL");
  }

  return missing;
}

export function assertProductionEnv() {
  if (env.NODE_ENV !== "production") {
    return;
  }

  const missing = getMissingProductionEnv();

  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }
}
