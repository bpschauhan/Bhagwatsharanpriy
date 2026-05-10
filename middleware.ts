import { NextResponse } from "next/server";
import { edgeAuth } from "@/auth.edge";
import { adminRoles, hasRole } from "@/lib/auth/roles";

export default edgeAuth((request) => {
  const { nextUrl } = request;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isContributorRoute = nextUrl.pathname.startsWith("/contribute");

  if (!isAdminRoute && !isContributorRoute) {
    return NextResponse.next();
  }

  const user = request.auth?.user;

  if (!user?.active) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && !hasRole(user.role, adminRoles)) {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/contribute/:path*"],
};
