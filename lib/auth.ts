import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { getPrismaClient } from "@/lib/db";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_COOKIE_OPTIONS,
  ADMIN_SESSION_MAX_AGE,
  createSessionToken,
  verifySessionToken,
  type AdminSession,
} from "@/lib/session";

export async function authenticateAdmin(email: string, password: string) {
  const prisma = getPrismaClient();

  if (!prisma) {
    return null;
  }

  const admin = await prisma.adminUser.findUnique({
    where: {
      email: email.toLowerCase().trim(),
    },
  });

  if (!admin) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

  if (!isValidPassword) {
    return null;
  }

  return {
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
  } satisfies AdminSession;
}

export async function createAdminSession(session: AdminSession) {
  const token = await createSessionToken(session);
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    ...ADMIN_SESSION_COOKIE_OPTIONS,
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    ...ADMIN_SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });
}

export async function getCurrentAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return verifySessionToken(token);
}

export async function requireAdminSession() {
  const session = await getCurrentAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
