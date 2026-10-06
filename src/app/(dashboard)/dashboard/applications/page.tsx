"use client";

import { useMyApplications, useCancelApplication } from "@/hooks";
import { applicationTitle, type Application } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";

export default function MyApplicationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useMyApplications();
  const { mutate: cancel } = useCancelApplication();
  const applications = data?.data as Application[] | undefined;

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Applications</h1>
      {!applications?.length ? (
        <p className="text-muted-foreground">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{applicationTitle(a)}</p>
                <p className="text-sm text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={a.status === "ACCEPTED" ? "default" : "secondary"}>{a.status}</Badge>
                {a.status === "PENDING" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      cancel(a.id, {
                        onSuccess: () => {
                          toast.success("Application cancelled");
                          qc.invalidateQueries({ queryKey: ["my-applications"] });
                        },
                        onError: (e) => toast.error(getErrorMessage(e)),
                      })
                    }
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
