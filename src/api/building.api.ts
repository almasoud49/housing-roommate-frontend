import apiClient from "@/lib/apiClient";
import type { ApiResponse, Building, ListResponse } from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface BuildingFilters extends ListParams {
  propertyId?: string;
  city?: string;
  sortBy?: "createdAt" | "name" | "floors";
}

export interface BuildingPayload {
  propertyId: string;
  name: string;
  floors: number;
  address: string;
  city: string;
}

export function getBuildings(params: BuildingFilters = {}) {
  return apiClient<ListResponse<Building>>(`/buildings${buildQuery(params)}`);
}

export function getBuildingsByProperty(propertyId: string, params: BuildingFilters = {}) {
  return apiClient<ListResponse<Building>>(`/buildings/property/${propertyId}${buildQuery(params)}`);
}

export function getBuildingById(id: string) {
  return apiClient<ApiResponse<Building>>(`/buildings/${id}`);
}

export function createBuilding(payload: BuildingPayload) {
  return apiClient<ApiResponse<Building>>("/buildings", { method: "POST", body: payload });
}

export function updateBuilding(id: string, payload: Partial<Omit<BuildingPayload, "propertyId">>) {
  return apiClient<ApiResponse<Building>>(`/buildings/${id}`, { method: "PATCH", body: payload });
}

export function deleteBuilding(id: string) {
  return apiClient<ApiResponse<null>>(`/buildings/${id}`, { method: "DELETE" });
}
