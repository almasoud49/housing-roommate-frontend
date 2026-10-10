import apiClient from "@/lib/apiClient";
import type { ApiResponse, ListResponse, ViewingRequest, ViewingStatus } from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface ViewingFilters extends ListParams {
  status?: ViewingStatus;
  roomId?: string;
  tenantId?: string;
  sortBy?: "createdAt" | "preferredDate";
}

export interface CreateViewingPayload {
  roomId: string;
  /** ISO datetime */
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

export function getViewings(params: ViewingFilters = {}) {
  return apiClient<ListResponse<ViewingRequest>>(`/viewings${buildQuery(params)}`);
}

export function getViewingById(id: string) {
  return apiClient<ApiResponse<ViewingRequest>>(`/viewings/${id}`);
}

export function createViewing(payload: CreateViewingPayload) {
  return apiClient<ApiResponse<ViewingRequest>>("/viewings", { method: "POST", body: payload });
}

/** Landlord / property manager / admin. */
export function updateViewingStatus(
  id: string,
  status: Exclude<ViewingStatus, "PENDING">,
) {
  return apiClient<ApiResponse<ViewingRequest>>(`/viewings/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function deleteViewing(id: string) {
  return apiClient<ApiResponse<null>>(`/viewings/${id}`, { method: "DELETE" });
}
