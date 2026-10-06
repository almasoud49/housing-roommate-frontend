import { useMutation, useQuery } from "@tanstack/react-query";
import { getNotifications, markAllRead } from "@/api";

export function useNotifications() {
  return useQuery({ queryKey: ["notifications"], queryFn: getNotifications });
}

export function useMarkAllNotificationsRead() {
  return useMutation({ mutationFn: markAllRead });
}
