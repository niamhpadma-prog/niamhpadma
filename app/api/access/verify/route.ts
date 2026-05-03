import { NextResponse } from "next/server";
import { verifyAccessToken, setAccessCookie } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/courses", request.url));
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/courses", request.url));
  }

  await setAccessCookie(token);

  return NextResponse.redirect(
    new URL(`/courses/${payload.courseSlug}/learn`, request.url)
  );
}
