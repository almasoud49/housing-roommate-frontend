import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ListResponse,
  MaintenancePriority,
  MaintenanceRequest,
  MaintenanceStatus,
} from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface MaintenanceFilters extends ListParams {
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  category?: string;
  roomId?: string;
  tenantId?: string;
  search?: string;
  sortBy?: "createdAt" | "priority" | "status";
}

export interface CreateMaintenancePayload {
  roomId: string;
  title: string;
  description: string;
  category: string;
  priority?: MaintenancePriority | string;
  images?: string[];
  estimatedCost?: number;
  scheduledAt?: string;
}

export interface UpdateMaintenancePayload {
  title?: string;
  description?: string;
  category?: string;
  priority?: MaintenancePriority | string;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  scheduledAt?: string;
  images?: string[];
}

export function getRequests(params: MaintenanceFilters = {}) {
  return apiClient<ListResponse<MaintenanceRequest>>(`/maintenance${buildQuery(params)}`);
}

export function getRequestById(id: string) {
  return apiClient<ApiResponse<MaintenanceRequest>>(`/maintenance/${id}`);
}

export function createRequest(payload: CreateMaintenancePayload) {
  return apiClient<ApiResponse<MaintenanceRequest>>("/maintenance", { method: "POST", body: payload });
}

export function updateRequest(id: string, payload: UpdateMaintenancePayload) {
  return apiClient<ApiResponse<MaintenanceRequest>>(`/maintenance/${id}`, { method: "PATCH", body: payload });
}

/** Landlord / property manager / admin. */
export function updateRequestStatus(id: string, status: MaintenanceStatus) {
  return apiClient<ApiResponse<MaintenanceRequest>>(`/maintenance/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function deleteRequest(id: string) {
  return apiClient<ApiResponse<null>>(`/maintenance/${id}`, { method: "DELETE" });
}
