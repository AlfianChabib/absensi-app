import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "./lib/auth-client";

const dashboardPages = ["/class", "/grade", "/attendance", "/export", "/import"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
    // baseURL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://192.168.1.84:3000",
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  if (dashboardPages.includes(pathname) && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/class", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/class", "/grade", "/attendance", "/export", "/import"],
};
