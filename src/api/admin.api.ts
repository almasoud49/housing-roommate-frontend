import apiClient from "@/lib/apiClient";
import type {
  AdminStats,
  AdminUser,
  ApiResponse,
  AuditLog,
  LandlordDashboard,
  ListResponse,
  UserRole,
} from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface AdminUserFilters extends ListParams {
  role?: UserRole;
  status?: "ACTIVE" | "BLOCKED";
  search?: string;
  sortBy?: "createdAt" | "email" | "name" | "role" | "status";
}

export interface AuditLogFilters extends ListParams {
  action?: string;
  entityType?: string;
  userId?: string;
}

export function getAdminStats() {
  return apiClient<ApiResponse<AdminStats>>("/admin/stats");
}

export function getAdminUsers(params: AdminUserFilters = {}) {
  return apiClient<ListResponse<AdminUser>>(`/admin/users${buildQuery(params)}`);
}

export function getAdminUserById(id: string) {
  return apiClient<ApiResponse<AdminUser>>(`/admin/users/${id}`);
}

export function updateUserRole(id: string, role: UserRole) {
  return apiClient<ApiResponse<AdminUser>>(`/admin/users/${id}/role`, { method: "PATCH", body: { role } });
}

export function toggleUserStatus(id: string, status: "ACTIVE" | "BLOCKED") {
  return apiClient<ApiResponse<AdminUser>>(`/admin/users/${id}/status`, { method: "PATCH", body: { status } });
}

export function deleteUser(id: string) {
  return apiClient<ApiResponse<null>>(`/admin/users/${id}`, { method: "DELETE" });
}

export function getAuditLogs(params: AuditLogFilters = {}) {
  return apiClient<ListResponse<AuditLog>>(`/admin/audit-logs${buildQuery(params)}`);
}

export function getLandlordDashboard() {
  return apiClient<ApiResponse<LandlordDashboard>>("/admin/dashboard/landlord");
}

export function getPropertyManagerDashboard() {
  return apiClient<ApiResponse<Record<string, unknown>>>("/admin/dashboard/property-manager");
}
