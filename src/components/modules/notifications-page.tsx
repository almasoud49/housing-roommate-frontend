"use client";

import { useNotifications, useMarkAllNotificationsRead } from "@/hooks";
import type { NotificationItem } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";

export default function NotificationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useNotifications();
  const { mutate: markAll } = useMarkAllNotificationsRead();

  const d = data?.data as unknown;
  const notifications: NotificationItem[] = Array.isArray(d) ? d : ((d as { data?: NotificationItem[] })?.data ?? []);

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline" size="sm" onClick={() => markAll(undefined, { onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }), onError: (e) => toast.error(getErrorMessage(e)) })}>Mark all read</Button>
      </div>
      {!notifications.length ? (
        <p className="text-muted-foreground">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className={`rounded-lg border p-4 ${n.isRead ? "" : "border-primary/30 bg-primary/5"}`}>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-muted-foreground">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
