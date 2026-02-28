import { config } from "dotenv";
import { z } from "zod";

config({ path: "../../.env" });
config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_STORAGE_BUCKET: z.string().default("article-covers"),
  JWT_SECRET: z.string().min(8),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  PORT: z.coerce.number().default(4000)
});

export const env = envSchema.parse(process.env);

