"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useLandlordApplications, useUpdateApplicationStatus } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import { applicationTitle, roomLabel, type ApplicationStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { ConfirmButton, ListState, PageHeader, PaginationBar, StatusBadge } from "@/components/modules/common";
import { formatDate } from "@/utils/format.util";

export default function LandlordApplicationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useLandlordApplications({ page, limit: 10, status: status || undefined, search: search || undefined });
  const { mutate: setAppStatus, isPending } = useUpdateApplicationStatus();
  const applications = data?.data ?? [];

  const change = (id: string, s: ApplicationStatus) =>
    setAppStatus({ id, status: s }, { onSuccess: () => toast.success(s === "ACCEPTED" ? "Application accepted" : "Application rejected"), onError: (e) => toast.error(getErrorMessage(e)) });

  return (
    <div>
      <PageHeader title="Applications" />
      <div className="mb-4 flex flex-wrap gap-3">
        <Input className="w-64" placeholder="Search tenant, room, building..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <NativeSelect className="w-44" value={status} onChange={(e) => { setStatus(e.target.value as ApplicationStatus | ""); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </NativeSelect>
      </div>
      <ListState isLoading={isLoading} error={error} isEmpty={!applications.length} emptyText="No applications received yet.">
        <div className="space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{a.tenant?.name ?? "Applicant"} — {applicationTitle(a)}</p>
                <p className="text-sm text-muted-foreground">{roomLabel(a.room)}</p>
                {a.message && <p className="mt-1 text-sm">“{a.message}”</p>}
                <p className="text-xs text-muted-foreground">{formatDate(a.createdAt)}{a.tenant?.email ? ` · ${a.tenant.email}` : ""}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={a.status} />
                {a.status === "PENDING" && (
                  <>
                    <Button size="sm" disabled={isPending} onClick={() => change(a.id, "ACCEPTED")}>Accept</Button>
                    <ConfirmButton size="sm" variant="destructive" title="Reject this application?" confirmLabel="Reject" pending={isPending} onConfirm={() => change(a.id, "REJECTED")}>
                      Reject
                    </ConfirmButton>
                  </>
                )}
                {a.status === "ACCEPTED" && (
                  <Button size="sm" variant="outline" render={<Link href="/landlord/documents" />}>Documents</Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <PaginationBar meta={data?.meta} onPageChange={setPage} />
      </ListState>
    </div>
  );
}
