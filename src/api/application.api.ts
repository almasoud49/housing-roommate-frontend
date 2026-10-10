import apiClient from "@/lib/apiClient";
import type { ApiResponse, Application, ApplicationStatus, ListResponse } from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface ApplicationFilters extends ListParams {
  status?: ApplicationStatus;
  search?: string;
  sortBy?: "createdAt" | "status";
}

export function createApplication(payload: { roomId: string; message?: string }) {
  return apiClient<ApiResponse<Application>>("/applications", { method: "POST", body: payload });
}

export function getMyApplications(params: ApplicationFilters = {}) {
  return apiClient<ListResponse<Application>>(`/applications/my-applications${buildQuery(params)}`);
}

export function getLandlordApplications(params: ApplicationFilters = {}) {
  return apiClient<ListResponse<Application>>(`/applications/landlord${buildQuery(params)}`);
}

export function updateApplicationStatus(id: string, status: ApplicationStatus) {
  return apiClient<ApiResponse<Application>>(`/applications/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function cancelApplication(id: string) {
  return apiClient<ApiResponse<null>>(`/applications/${id}/cancel`, { method: "PATCH" });
}

/** Send a message update with an application */
export function sendApplicationMessage(applicationId: string, content: string) {
  return apiClient<ApiResponse<Application>>(`/applications/${applicationId}/message`, {
    method: "PATCH",
    body: { content },
  });
}

/** Get message history for an application - returns messages */
export function getApplicationMessages(applicationId: string) {
  return apiClient<ApiResponse<{ id: string; content: string; createdAt: string; read: boolean }[]>>(`/applications/${applicationId}/messages`);
}

/** Mark a message as read */
export function markMessageRead(messageId: string) {
  return apiClient<ApiResponse<{ id: string; content: string; createdAt: string; read: boolean }>>(`/messages/${messageId}/read`, {
    method: "PATCH",
  });
}

/** Get recent message threads */
export function getRecentThreads(type: "application" | "viewing" = "application") {
  return apiClient<ApiResponse<{ applicationId?: string; viewingId?: string; lastMessage: { id: string; content: string; createdAt: string; read: boolean }; unreadCount: number }[]>>(`/messages/recent-${type}`);
}
