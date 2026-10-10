"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useNotificationStream,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { ListState, PageHeader, PaginationBar } from "@/components/modules/common";
import { formatDateTime } from "@/utils/format.util";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"" | "unread" | "read">("");
  const { data, isLoading, error } = useNotifications({
    page,
    limit: 10,
    ...(filter ? { isRead: filter === "read" } : {}),
  });
  const markAll = useMarkAllNotificationsRead();
  const markOne = useMarkNotificationRead();
  const remove = useDeleteNotification();
  useNotificationStream();

  const notifications = data?.data ?? [];
  const onError = (e: unknown) => toast.error(getErrorMessage(e));

  return (
    <div>
      <PageHeader
        title="Notifications"
        action={
          <div className="flex gap-2">
            <NativeSelect className="w-32" value={filter} onChange={(e) => { setFilter(e.target.value as typeof filter); setPage(1); }}>
              <option value="">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </NativeSelect>
            <Button variant="outline" size="sm" disabled={markAll.isPending} onClick={() => markAll.mutate(undefined, { onSuccess: () => toast.success("All marked as read"), onError })}>
              Mark all read
            </Button>
          </div>
        }
      />
      <ListState isLoading={isLoading} error={error} isEmpty={!notifications.length} emptyText="No notifications yet.">
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start justify-between gap-3 rounded-lg border p-4 ${n.isRead ? "" : "border-primary/30 bg-primary/5"}`}>
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(n.createdAt)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!n.isRead && (
                  <Button size="sm" variant="outline" onClick={() => markOne.mutate(n.id, { onError })}>
                    Mark read
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => remove.mutate(n.id, { onSuccess: () => toast.success("Deleted"), onError })}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        <PaginationBar meta={data?.meta} onPageChange={setPage} />
      </ListState>
    </div>
  );
}
