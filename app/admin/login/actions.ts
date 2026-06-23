"use server";

import { redirect } from "next/navigation";

import { authenticateAdmin, createAdminSession } from "@/lib/auth";
import { ADMIN_SESSION_COOKIE } from "@/lib/session";

export type LoginFormState = {
  error?: string;
};

function getSafeAdminRedirectPath(value: FormDataEntryValue | null) {
  const fallback = "/admin";

  if (typeof value !== "string") {
    return fallback;
  }

  if (!value.startsWith("/admin")) {
    return fallback;
  }

  if (value.startsWith("/admin/login")) {
    return fallback;
  }

  if (value.startsWith("/admin/logout")) {
    return fallback;
  }

  return value;
}

export async function loginAction(
  _previousState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = getSafeAdminRedirectPath(formData.get("next"));

  if (!email || !password) {
    return {
      error: "E-posta ve şifre alanlarını doldurun.",
    };
  }

  const admin = await authenticateAdmin(email, password);

  if (!admin) {
    return {
      error: "E-posta veya şifre hatalı.",
    };
  }

  await createAdminSession(admin);

  console.log("[ADMIN_LOGIN_SUCCESS]", {
    email: admin.email,
    nodeEnv: process.env.NODE_ENV,
    hasAuthSecret: Boolean(process.env.AUTH_SECRET),
    authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
    cookieName: ADMIN_SESSION_COOKIE,
  });

  redirect(redirectTo);
}
