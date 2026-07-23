import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  requireAdmin,
} from "../cms/auth.server";

export const loginFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    return loginAdmin(data.email, data.password);
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  await logoutAdmin();
  return { ok: true };
});

export const meFn = createServerFn({ method: "GET" }).handler(async () => {
  return getCurrentAdmin();
});

export const requireAdminFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return requireAdmin();
  },
);
