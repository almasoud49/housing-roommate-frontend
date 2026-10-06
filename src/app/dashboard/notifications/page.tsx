"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage, type ApiSuccess } from "@/lib/api";
import type { Notification } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      const d = res.data?.data;
      return (Array.isArray(d) ? d : d?.data ?? []) as Notification[];
    },
  });
  const markAll = useMutation({
    mutationFn: async () => api.patch("/notifications/read-all"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline" size="sm" onClick={() => markAll.mutate()}>Mark all read</Button>
      </div>
      {!data?.length ? (
        <p className="text-muted-foreground">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((n) => (
            <div key={n.id} className={`rounded-lg border p-4 ${n.isRead ? "" : "bg-primary/5 border-primary/30"}`}>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-muted-foreground">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
