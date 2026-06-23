import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export const ADMIN_SESSION_COOKIE = "bimola_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;
export const ADMIN_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ADMIN_SESSION_MAX_AGE,
};

export type AdminSession = {
  adminId: string;
  email: string;
  name?: string | null;
};

export type SessionVerifyReason =
  | "missing-cookie"
  | "missing-secret"
  | "invalid-token"
  | "expired-token"
  | "verify-exception"
  | "ok";

export type SessionVerifyResult =
  | {
      valid: true;
      reason: "ok";
      session: AdminSession;
    }
  | {
      valid: false;
      reason: Exclude<SessionVerifyReason, "ok">;
    };

const issuer = "bimola-teras-admin";
const audience = "bimola-teras-dashboard";
const developmentSecret = "development-only-bimola-auth-secret";

function getSecretValue() {
  const secret = process.env.AUTH_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is required in production.");
  }

  return secret ?? developmentSecret;
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
  const result = await verifySessionTokenWithReason(token);

  return result.valid ? result.session : null;
}

export async function verifySessionTokenWithReason(
  token?: string | null
): Promise<SessionVerifyResult> {
  if (!token) {
    return { valid: false, reason: "missing-cookie" };
  }

  const secret = process.env.AUTH_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    return { valid: false, reason: "missing-secret" };
  }

  try {
    const encodedSecret = new TextEncoder().encode(secret ?? developmentSecret);
    const { payload } = await jwtVerify(token, encodedSecret, {
      issuer,
      audience,
    });

    if (!payload.sub || typeof payload.email !== "string") {
      return { valid: false, reason: "invalid-token" };
    }

    return {
      valid: true,
      reason: "ok",
      session: {
        adminId: payload.sub,
        email: payload.email,
        name: typeof payload.name === "string" ? payload.name : null,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        valid: false,
        reason: error.name === "JWTExpired" ? "expired-token" : "invalid-token",
      };
    }

    return { valid: false, reason: "verify-exception" };
  }
}
