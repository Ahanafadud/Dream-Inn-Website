import process from "node:process";
import { config as loadEnv } from "dotenv";

// Vite already loads .env into process.env in many cases; quiet avoids tip spam when 0 new keys are added.
loadEnv({ quiet: true });

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    db: {
      host: process.env.DB_HOST ?? "127.0.0.1",
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER ?? "root",
      password: process.env.DB_PASSWORD ?? "",
      database: process.env.DB_NAME ?? "dreaminn_website",
    },
    sessionSecret:
      process.env.SESSION_SECRET ?? "dreaminn-dev-session-secret-key-32",
    adminEmail: process.env.ADMIN_EMAIL ?? "admin@rrpdreaminn.com",
    adminPassword: process.env.ADMIN_PASSWORD ?? "ChangeMe123!",
  };
}

export function getSessionConfig() {
  const password = getServerConfig().sessionSecret;
  // useSession requires password length >= 32
  const padded = password.length >= 32 ? password : password.padEnd(32, "0");
  return {
    password: padded,
    name: "dreaminn_session",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}
