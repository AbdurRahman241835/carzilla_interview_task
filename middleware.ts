import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
console.log("Middleware running. Path:", pathname,);

  // Not logged in → block protected routes
  if (!token && !isAuthPage) {
    console.log("No token found, redirecting to login.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Already logged in → block login/signup
  if (token && isAuthPage) {
    console.log("Token found, redirecting to home.");

    try {
      const res = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log("Token valid:", res);
      return NextResponse.redirect(new URL("/", req.url));
    } catch (err) {
      console.log("middleware catch error message", err);

      // Token expired/invalid → clear cookie and go to login
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup"], // protect these routes
  runtime: "nodejs",
};
