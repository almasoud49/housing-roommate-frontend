"use client";

import { useLandlordApplications, useUpdateApplicationStatus } from "@/hooks";
import { applicationTitle, type Application } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";

export default function LandlordApplicationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useLandlordApplications();
  const { mutate: setStatus } = useUpdateApplicationStatus();
  const applications = data?.data as Application[] | undefined;

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Applications</h1>
      {!applications?.length ? (
        <p className="text-muted-foreground">No applications received yet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
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
                    <Button size="sm" onClick={() => setStatus({ id: a.id, status: "ACCEPTED" }, { onSuccess: () => { toast.success("Accepted"); qc.invalidateQueries({ queryKey: ["landlord-applications"] }); }, onError: (e) => toast.error(getErrorMessage(e)) })}>Accept</Button>
                    <Button size="sm" variant="destructive" onClick={() => setStatus({ id: a.id, status: "REJECTED" }, { onSuccess: () => { toast.success("Rejected"); qc.invalidateQueries({ queryKey: ["landlord-applications"] }); }, onError: (e) => toast.error(getErrorMessage(e)) })}>Reject</Button>
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
