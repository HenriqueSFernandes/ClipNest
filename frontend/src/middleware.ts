import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-better-auth.session_token"
      : "better-auth.session_token";
  const session = request.cookies.get(cookieName);

  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
