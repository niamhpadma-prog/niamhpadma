import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.COURSE_ACCESS_SECRET || "dev-secret");

const COOKIE_NAME = "course_access";

export interface AccessPayload {
  email: string;
  courseSlug: string;
}

export async function generateAccessToken(email: string, courseSlug: string): Promise<string> {
  return new SignJWT({ email, courseSlug })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(secret);
}

export async function verifyAccessToken(token: string): Promise<AccessPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { email: payload.email as string, courseSlug: payload.courseSlug as string };
  } catch {
    return null;
  }
}

export async function setAccessCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });
}

export async function getAccessFromCookie(): Promise<AccessPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

export { COOKIE_NAME };
