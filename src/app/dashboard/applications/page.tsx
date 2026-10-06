"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage, type ApiSuccess } from "@/lib/api";
import { applicationTitle, type Application } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MyApplicationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => (await api.get<ApiSuccess<Application[]>>("/applications/my-applications")).data.data,
  });
  const cancel = useMutation({
    mutationFn: async (id: string) => api.patch(`/applications/${id}/cancel`),
    onSuccess: () => { toast.success("Application cancelled"); qc.invalidateQueries({ queryKey: ["my-applications"] }); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Applications</h1>
      {!data?.length ? (
        <p className="text-muted-foreground">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((a) => (
            <div key={a.id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{applicationTitle(a)}</p>
                <p className="text-sm text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={a.status === "ACCEPTED" ? "default" : "secondary"}>{a.status}</Badge>
                {a.status === "PENDING" && (
                  <Button size="sm" variant="destructive" onClick={() => cancel.mutate(a.id)}>Cancel</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
