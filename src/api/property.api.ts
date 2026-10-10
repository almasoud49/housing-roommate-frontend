import apiClient from "@/lib/apiClient";
import type { ApiResponse, ListResponse, Property } from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface PropertyFilters extends ListParams {
  search?: string;
  city?: string;
  sortBy?: "createdAt" | "title" | "city";
}

export interface PropertyPayload {
  title: string;
  description: string;
  address: string;
  city: string;
}

export function getProperties(params: PropertyFilters = {}) {
  return apiClient<ListResponse<Property>>(`/properties${buildQuery(params)}`);
}

export function getPropertyById(id: string) {
  return apiClient<ApiResponse<Property>>(`/properties/${id}`);
}

export function getMyProperties(params: PropertyFilters = {}) {
  return apiClient<ListResponse<Property>>(`/properties/my-properties${buildQuery(params)}`);
}

export function createProperty(payload: PropertyPayload) {
  return apiClient<ApiResponse<Property>>("/properties", { method: "POST", body: payload });
}

export function updateProperty(id: string, payload: Partial<PropertyPayload>) {
  return apiClient<ApiResponse<Property>>(`/properties/${id}`, { method: "PATCH", body: payload });
}

export function deleteProperty(id: string) {
  return apiClient<ApiResponse<null>>(`/properties/${id}`, { method: "DELETE" });
}
