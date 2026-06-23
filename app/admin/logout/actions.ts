"use server";

import { redirect } from "next/navigation";

import { clearAdminSession } from "@/lib/auth";

export async function logoutAction() {
  await clearAdminSession();

  console.log("[ADMIN_LOGOUT_ACTION]", {
    method: "server-action",
  });

  redirect("/admin/login");
}
