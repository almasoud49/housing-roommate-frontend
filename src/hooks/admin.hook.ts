import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAdminStats,
  getAdminUsers,
  getAuditLogs,
  getLandlordDashboard,
  toggleUserStatus,
} from "@/api";

export function useAdminStats() {
  return useQuery({ queryKey: ["admin-stats"], queryFn: getAdminStats });
}

export function useAdminUsers(params: { role?: string; status?: string }) {
  return useQuery({ queryKey: ["admin-users", params], queryFn: () => getAdminUsers(params) });
}

export function useToggleUserStatus() {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "BLOCKED" }) =>
      toggleUserStatus(id, status),
  });
}

export function useAuditLogs() {
  return useQuery({ queryKey: ["audit-logs"], queryFn: getAuditLogs });
}

export function useLandlordDashboard() {
  return useQuery({ queryKey: ["landlord-dashboard"], queryFn: getLandlordDashboard });
}
