import "server-only";

import type { UserRole } from "@prisma/client";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { adminRoles, editorRoles, hasRole, reviewerRoles } from "@/lib/auth/roles";
export { adminRoles, contributorRoles, editorRoles, hasMinimumRole, hasRole, reviewerRoles } from "@/lib/auth/roles";

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.active) {
    redirect("/login" as Route);
  }

  return session.user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireUser();

  if (!hasRole(user.role, allowedRoles)) {
    redirect("/unauthorized" as Route);
  }

  return user;
}

export async function requireAdminAccess() {
  return requireRole(adminRoles);
}

export async function requireEditorAccess() {
  return requireRole(editorRoles);
}

export async function requireReviewerAccess() {
  return requireRole(reviewerRoles);
}
