import apiClient from "@/lib/apiClient";
import type { ApiResponse, Flat, ListResponse } from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface FlatFilters extends ListParams {
  buildingId?: string;
  sortBy?: "createdAt" | "flatNumber" | "floor";
}

export interface FlatPayload {
  buildingId: string;
  flatNumber: string;
  floor: number;
}

export function getFlats(params: FlatFilters = {}) {
  return apiClient<ListResponse<Flat>>(`/flats${buildQuery(params)}`);
}

export function getFlatsByBuilding(buildingId: string, params: FlatFilters = {}) {
  return apiClient<ListResponse<Flat>>(`/flats/building/${buildingId}${buildQuery(params)}`);
}

export function getFlatById(id: string) {
  return apiClient<ApiResponse<Flat>>(`/flats/${id}`);
}

export function createFlat(payload: FlatPayload) {
  return apiClient<ApiResponse<Flat>>("/flats", { method: "POST", body: payload });
}

export function updateFlat(id: string, payload: Partial<Omit<FlatPayload, "buildingId">>) {
  return apiClient<ApiResponse<Flat>>(`/flats/${id}`, { method: "PATCH", body: payload });
}

export function deleteFlat(id: string) {
  return apiClient<ApiResponse<null>>(`/flats/${id}`, { method: "DELETE" });
}
