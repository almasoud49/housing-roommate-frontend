"use client";

import { useQuery } from "@tanstack/react-query";
import { api, type ApiSuccess } from "@/lib/api";
import type { ViewingRequest } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ViewingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-viewings"],
    queryFn: async () => (await api.get<ApiSuccess<ViewingRequest[]>>("/viewings")).data.data,
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Viewing Requests</h1>
      {!data?.length ? (
        <p className="text-muted-foreground">No viewing requests yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{v.property?.title ?? "Property"}</p>
                <p className="text-sm text-muted-foreground">{v.scheduledAt ? new Date(v.scheduledAt).toLocaleString() : new Date(v.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge variant="secondary">{v.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
