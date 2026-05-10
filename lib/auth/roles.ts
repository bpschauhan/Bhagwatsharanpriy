import type { UserRole } from "@prisma/client";

const roleRank: Record<UserRole, number> = {
  CONTRIBUTOR: 1,
  REVIEWER: 2,
  EDITOR: 3,
  ADMIN: 4,
};

export const adminRoles: UserRole[] = ["ADMIN", "EDITOR", "REVIEWER"];
export const editorRoles: UserRole[] = ["ADMIN", "EDITOR"];
export const reviewerRoles: UserRole[] = ["ADMIN", "REVIEWER"];
export const contributorRoles: UserRole[] = ["ADMIN", "EDITOR", "REVIEWER", "CONTRIBUTOR"];

export function hasRole(userRole: UserRole | undefined, allowed: UserRole[]) {
  return Boolean(userRole && allowed.includes(userRole));
}

export function hasMinimumRole(userRole: UserRole | undefined, minimumRole: UserRole) {
  return Boolean(userRole && roleRank[userRole] >= roleRank[minimumRole]);
}
