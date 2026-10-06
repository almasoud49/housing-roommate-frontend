import apiClient from "@/lib/apiClient";

export function getAdminStats() {
  return apiClient("/admin/stats");
}

export function getAdminUsers(params: { role?: string; status?: string }) {
  const sp = new URLSearchParams();
  if (params.role) sp.set("role", params.role);
  if (params.status) sp.set("status", params.status);
  return apiClient(`/admin/users?${sp.toString()}`);
}

export function toggleUserStatus(id: string, status: "ACTIVE" | "BLOCKED") {
  return apiClient(`/admin/users/${id}/status`, { method: "PATCH", body: { status } });
}

export function getAuditLogs() {
  return apiClient("/admin/audit-logs");
}

export function getLandlordDashboard() {
  return apiClient("/admin/dashboard/landlord");
}
