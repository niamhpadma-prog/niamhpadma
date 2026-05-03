import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.COURSE_ACCESS_SECRET || "dev-secret");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect course learning routes
  const learnMatch = pathname.match(/^\/courses\/([^/]+)\/learn/);
  if (!learnMatch) return NextResponse.next();

  const courseSlug = learnMatch[1];
  const token = request.cookies.get("course_access")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL(`/courses/${courseSlug}?access=required`, request.url)
    );
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    // Verify the token is for this specific course
    if (payload.courseSlug !== courseSlug) {
      return NextResponse.redirect(
        new URL(`/courses/${courseSlug}?access=required`, request.url)
      );
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL(`/courses/${courseSlug}?access=required`, request.url)
    );
  }
}

export const config = {
  matcher: "/courses/:slug/learn/:path*",
};
