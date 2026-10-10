import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllRead,
  markNotificationRead,
  notificationStreamUrl,
  type NotificationFilters,
} from "@/api";
import { getAccessToken } from "@/utils/auth.utils";

export function useNotifications(params: NotificationFilters = {}) {
  return useQuery({ queryKey: ["notifications", params], queryFn: () => getNotifications(params) });
}

export function useUnreadCount() {
  return useQuery({ queryKey: ["notifications-unread"], queryFn: getUnreadCount });
}

function useInvalidateNotifications() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["notifications"] });
    qc.invalidateQueries({ queryKey: ["notifications-unread"] });
  };
}

export function useMarkAllNotificationsRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({ mutationFn: markAllRead, onSuccess: invalidate });
}

export function useMarkNotificationRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({ mutationFn: markNotificationRead, onSuccess: invalidate });
}

export function useDeleteNotification() {
  const invalidate = useInvalidateNotifications();
  return useMutation({ mutationFn: deleteNotification, onSuccess: invalidate });
}

/**
 * Subscribes to GET /notifications/stream (SSE). Refreshes the notification
 * queries whenever the server pushes a new notification or unread count.
 */
export function useNotificationStream(enabled = true) {
  const qc = useQueryClient();
  useEffect(() => {
    const token = getAccessToken();
    if (!enabled || !token || typeof EventSource === "undefined") return;

    const es = new EventSource(notificationStreamUrl(token));
    const refresh = () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications-unread"] });
    };
    es.addEventListener("notification", refresh);
    es.addEventListener("unread-count", refresh);
    return () => es.close();
  }, [enabled, qc]);
}
