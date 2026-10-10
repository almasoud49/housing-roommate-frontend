import apiClient from "@/lib/apiClient";
import type { ApiResponse, ListResponse, NotificationItem } from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface NotificationFilters extends ListParams {
  type?: string;
  isRead?: boolean;
}

export function getNotifications(params: NotificationFilters = {}) {
  return apiClient<ListResponse<NotificationItem>>(`/notifications${buildQuery(params)}`);
}

export function getUnreadCount() {
  return apiClient<ApiResponse<{ unreadCount: number }>>("/notifications/unread-count");
}

export function markAllRead() {
  return apiClient<ApiResponse<unknown>>("/notifications/read-all", { method: "PATCH" });
}

export function markNotificationRead(id: string) {
  return apiClient<ApiResponse<NotificationItem>>(`/notifications/${id}/read`, { method: "PATCH" });
}

export function deleteNotification(id: string) {
  return apiClient<ApiResponse<null>>(`/notifications/${id}`, { method: "DELETE" });
}

/**
 * SSE endpoint URL. Native EventSource can't send an Authorization header,
 * so the backend accepts the access token as `?token=`.
 */
export function notificationStreamUrl(token: string) {
  return `${process.env.NEXT_PUBLIC_API_URL}/notifications/stream?token=${encodeURIComponent(token)}`;
}
