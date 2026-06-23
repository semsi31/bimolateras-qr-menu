import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export const ADMIN_SESSION_COOKIE = "bimola_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

export type AdminSession = {
  adminId: string;
  email: string;
  name?: string | null;
};

const issuer = "bimola-teras-admin";
const audience = "bimola-teras-dashboard";

function getSecretValue() {
  const secret = process.env.AUTH_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production.");
  }

  return secret ?? "development-only-bimola-auth-secret";
}

function getEncodedSecret() {
  return new TextEncoder().encode(getSecretValue());
}

export async function createSessionToken(session: AdminSession) {
  return new SignJWT({
    email: session.email,
    name: session.name ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.adminId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_MAX_AGE}s`)
    .sign(getEncodedSecret());
}

export async function verifySessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getEncodedSecret(), {
      issuer,
      audience,
    });

    if (!payload.sub || typeof payload.email !== "string") {
      return null;
    }

    return {
      adminId: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : null,
    } satisfies AdminSession;
  } catch {
    return null;
  }
}
