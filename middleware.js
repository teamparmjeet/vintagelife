import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = req.nextUrl.clone();

  // If user is already logged in, prevent access to /signin
  if (token && url.pathname === "/signin") {
    if (token.usertype === "2") {
      url.pathname = "/superadmin";
    } else if (token.usertype === "1") {
      url.pathname = "/admin";
    } else if (token.usertype === "0") {
      url.pathname = "/user";
    } else {
      url.pathname = "/";
    }
    return NextResponse.redirect(url);
  }

  // If no token, redirect all protected routes to /signin
  if (!token && ["/superadmin", "/admin", "/user"].some(path => url.pathname.startsWith(path))) {
    console.log("No token found, redirecting to /signin");
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (token) {
    const usertype = token.usertype;

    if (url.pathname.startsWith("/superadmin") && usertype !== "2") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith("/admin") && usertype !== "1") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith("/user") && usertype !== "0") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/superadmin/:path*", "/admin/:path*", "/user/:path*"],
};
