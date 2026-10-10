import apiClient from "@/lib/apiClient";
import type { ApiResponse, ListResponse, Room } from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface RoomFilters extends ListParams {
  flatId?: string;
  isActive?: boolean;
  availableFrom?: string;
  availableTo?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "createdAt" | "price" | "name";
}

export interface RoomPayload {
  flatId: string;
  name: string;
  price: number;
  availableFrom?: string;
  availableTo?: string;
  isActive?: boolean;
}

export function getRooms(params: RoomFilters = {}) {
  return apiClient<ListResponse<Room>>(`/rooms${buildQuery(params)}`);
}

export function getMyRooms(params: RoomFilters = {}) {
  return apiClient<ListResponse<Room>>(`/rooms/my-rooms${buildQuery(params)}`);
}

export function getRoomById(id: string) {
  return apiClient<ApiResponse<Room>>(`/rooms/${id}`);
}

export function createRoom(payload: RoomPayload) {
  return apiClient<ApiResponse<Room>>("/rooms", { method: "POST", body: payload });
}

export function updateRoom(id: string, payload: Partial<Omit<RoomPayload, "flatId">>) {
  return apiClient<ApiResponse<Room>>(`/rooms/${id}`, { method: "PATCH", body: payload });
}

export function deleteRoom(id: string) {
  return apiClient<ApiResponse<null>>(`/rooms/${id}`, { method: "DELETE" });
}
