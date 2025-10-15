// lib/role-redirect.ts
import { UserRole } from "next-auth";

export function getRoleBasedRedirect(role: UserRole, id: string) {
  return role === 'manager' ? `/dashboard/${id}` : `/user/${id}`;
}