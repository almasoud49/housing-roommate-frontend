"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage, type ApiSuccess } from "@/lib/api";
import { applicationTitle, type Application } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LandlordApplicationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["landlord-applications"],
    queryFn: async () => (await api.get<ApiSuccess<Application[]>>("/applications/landlord")).data.data,
  });
  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "ACCEPTED" | "REJECTED" }) =>
      api.patch(`/applications/${id}/status`, { status }),
    onSuccess: () => { toast.success("Application updated"); qc.invalidateQueries({ queryKey: ["landlord-applications"] }); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Applications</h1>
      {!data?.length ? (
        <p className="text-muted-foreground">No applications received yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((a) => (
            <div key={a.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{a.tenant?.name ?? "Applicant"} — {applicationTitle(a)}</p>
                {a.message && <p className="text-sm text-muted-foreground">{a.message}</p>}
                <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{a.status}</Badge>
                {a.status === "PENDING" && (
                  <>
                    <Button size="sm" onClick={() => setStatus.mutate({ id: a.id, status: "ACCEPTED" })}>Accept</Button>
                    <Button size="sm" variant="destructive" onClick={() => setStatus.mutate({ id: a.id, status: "REJECTED" })}>Reject</Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
