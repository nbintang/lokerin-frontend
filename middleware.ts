import { NextRequest, NextResponse } from "next/server";
import { jwtDecode, JwtUserPayload } from "./shared-api/helpers/jwtDecode";
import { isExpiredToken } from "./shared-api/helpers/isExpiredToken";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;
  const tokenQueryConfirmation = req.nextUrl.searchParams.get("token");
  const isProtected =
    pathname.startsWith("/administrator") ||
    pathname.startsWith("/recruiter") ||
    pathname.startsWith("/applier");
  const isPublicRequireVerified = pathname.startsWith("/jobs");

  // jika token gada, dan coba akses protected, redirect ke sign in
  if (!accessToken) {
    if (isProtected) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    return NextResponse.next();
  }

  let tokenPayload: JwtUserPayload;
  try {
    tokenPayload = jwtDecode(accessToken);
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  const { role, verified } = tokenPayload;

  // jika token ada, dan coba akses public require verified, redirect ke verify
  if (!verified && isPublicRequireVerified) {
    return NextResponse.redirect(new URL("/auth/verify", req.url));
  }
   if (
    pathname === "/" ||
    pathname === "/auth/signin"
  ) {
    if (role === "ADMINISTRATOR") {
      return NextResponse.redirect(new URL("/administrator/dashboard", req.url));
    }
    if (role === "RECRUITER") {
      return NextResponse.redirect(new URL("/recruiter/dashboard", req.url));
    }
    if (role === "MEMBER") {
      return NextResponse.redirect(new URL("/applier/dashboard", req.url));
    }
  }

  // Role guard: jika role tidak sesuai dengan prefix url, redirect ke dashboardnya
  if (role === "ADMINISTRATOR" && !pathname.startsWith("/administrator")) {
    return NextResponse.redirect(new URL("/administrator/dashboard", req.url));
  }
  if (role === "RECRUITER" && !pathname.startsWith("/recruiter")) {
    return NextResponse.redirect(new URL("/recruiter/dashboard", req.url));
  }
  if (role === "MEMBER" && !pathname.startsWith("/applier")) {
    return NextResponse.redirect(new URL("/applier/dashboard", req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/auth/verify",  
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
