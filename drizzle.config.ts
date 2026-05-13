import { defineConfig } from "drizzle-kit";
import * as dotenv from '@dotenvx/dotenvx';

// Load environment variables from .env
dotenv.config({ convention: 'nextjs' });

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

