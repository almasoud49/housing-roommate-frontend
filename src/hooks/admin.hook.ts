import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteUser,
  getAdminStats,
  getAdminUserById,
  getAdminUsers,
  getAuditLogs,
  getLandlordDashboard,
  getPropertyManagerDashboard,
  toggleUserStatus,
  updateUserRole,
  type AdminUserFilters,
  type AuditLogFilters,
} from "@/api";
import type { UserRole } from "@/types";

export function useAdminStats() {
  return useQuery({ queryKey: ["admin-stats"], queryFn: getAdminStats });
}

export function useAdminUsers(params: AdminUserFilters = {}) {
  return useQuery({ queryKey: ["admin-users", params], queryFn: () => getAdminUsers(params) });
}

export function useAdminUser(id: string) {
  return useQuery({ queryKey: ["admin-user", id], queryFn: () => getAdminUserById(id), enabled: !!id });
}

function useInvalidateUsers() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["admin-users"] });
    qc.invalidateQueries({ queryKey: ["admin-user"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };
}

export function useToggleUserStatus() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "BLOCKED" }) => toggleUserStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useUpdateUserRole() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => updateUserRole(id, role),
    onSuccess: invalidate,
  });
}

export function useDeleteUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({ mutationFn: deleteUser, onSuccess: invalidate });
}

export function useAuditLogs(params: AuditLogFilters = {}) {
  return useQuery({ queryKey: ["audit-logs", params], queryFn: () => getAuditLogs(params) });
}

export function useLandlordDashboard(enabled = true) {
  return useQuery({ queryKey: ["landlord-dashboard"], queryFn: getLandlordDashboard, enabled });
}

export function usePropertyManagerDashboard(enabled = true) {
  return useQuery({ queryKey: ["pm-dashboard"], queryFn: getPropertyManagerDashboard, enabled });
}
