"use server";

import { redirect } from "next/navigation";

import { authenticateAdmin, createAdminSession } from "@/lib/auth";

export type LoginFormState = {
  error?: string;
};

function getSafeRedirectPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return "/admin";
  }

  if (!value.startsWith("/admin") || value.startsWith("/admin/login")) {
    return "/admin";
  }

  return value;
}

export async function loginAction(
  _previousState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = getSafeRedirectPath(formData.get("next"));

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
    hasCookie: true,
    nodeEnv: process.env.NODE_ENV,
  });

  redirect(redirectTo);
}
