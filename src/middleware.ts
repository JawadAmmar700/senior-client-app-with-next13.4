import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/auth-session";

export async function middleware(request: NextRequest) {
  const session = await getSession(request.headers.get("cookie") ?? "");
  if (session && request.nextUrl.pathname.startsWith("/auth/signin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (session && request.nextUrl.pathname.startsWith("/auth/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!session && request.nextUrl.pathname.startsWith("/room")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  if (!session && request.nextUrl.pathname.startsWith("/room/[id]")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|/).*)"],
};
