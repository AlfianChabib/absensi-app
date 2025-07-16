import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "./lib/auth-client";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
    // baseURL: request.nextUrl.origin,
    baseURL: "http://192.168.1.84:3000",
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  if (pathname === "/grade" && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/grade", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/grade", "/attendance", "/export"],
};
