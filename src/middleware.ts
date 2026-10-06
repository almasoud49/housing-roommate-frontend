import { NextResponse, type NextRequest } from "next/server";

const TENANT_PREFIX = "/dashboard";
const LANDLORD_PREFIX = "/landlord";
const ADMIN_PREFIX = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("hr_role")?.value;

  const isAuthArea =
    pathname.startsWith(TENANT_PREFIX) ||
    pathname.startsWith(LANDLORD_PREFIX) ||
    pathname.startsWith(ADMIN_PREFIX);

  if (isAuthArea && !role) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith(ADMIN_PREFIX) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith(LANDLORD_PREFIX) && role !== "LANDLORD" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith(TENANT_PREFIX) && role !== "TENANT") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/login" && role) {
    const dest =
      role === "ADMIN" ? "/admin" : role === "LANDLORD" ? "/landlord" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/landlord/:path*", "/admin/:path*", "/login"],
};
