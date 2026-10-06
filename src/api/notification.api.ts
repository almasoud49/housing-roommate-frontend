import apiClient from "@/lib/apiClient";

export function getNotifications() {
  return apiClient("/notifications");
}

export function markAllRead() {
  return apiClient("/notifications/read-all", { method: "PATCH" });
}
