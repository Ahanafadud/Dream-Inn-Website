import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      `mysql://${process.env.DB_USER ?? "root"}${
        process.env.DB_PASSWORD ? `:${process.env.DB_PASSWORD}` : ""
      }@${process.env.DB_HOST ?? "127.0.0.1"}:${process.env.DB_PORT ?? "3306"}/${
        process.env.DB_NAME ?? "dreaminn_website"
      }`,
  },
});
