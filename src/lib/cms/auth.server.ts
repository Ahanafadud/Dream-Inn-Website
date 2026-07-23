import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import {
  clearSession,
  useSession,
} from "@tanstack/react-start/server";
import { getDb } from "../db";
import { admins } from "../db/schema";
import { getSessionConfig } from "../config.server";

export type AdminSessionData = {
  adminId?: number;
  email?: string;
};

export async function getAdminSession() {
  return useSession<AdminSessionData>(getSessionConfig());
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.data.adminId) {
    throw new Error("Unauthorized");
  }
  return session.data;
}

export async function loginAdmin(email: string, password: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email.toLowerCase().trim()))
    .limit(1);
  const admin = rows[0];
  if (!admin) return { ok: false as const, error: "Invalid email or password" };

  const valid = await compare(password, admin.passwordHash);
  if (!valid) return { ok: false as const, error: "Invalid email or password" };

  const session = await getAdminSession();
  await session.update({
    adminId: admin.id,
    email: admin.email,
  });

  return { ok: true as const, email: admin.email };
}

export async function logoutAdmin() {
  await clearSession(getSessionConfig());
}

export async function getCurrentAdmin() {
  const session = await getAdminSession();
  if (!session.data.adminId) return null;
  return { id: session.data.adminId, email: session.data.email ?? "" };
}
