// lib/role-redirect.ts
import { UserRole } from "@/lib/auth/withAuth";

export function getRoleBasedRedirect(role: UserRole, id: string) {
  return role === 'manager' ? `/dashboard/${id}` : `/user/${id}`;
}