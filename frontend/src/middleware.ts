import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("better-auth.session_token");

  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
