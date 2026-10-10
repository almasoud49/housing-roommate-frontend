"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCancelApplication, useMyApplications } from "@/hooks";
import { applicationTitle, roomLabel, type ApplicationStatus } from "@/types";
import { getErrorMessage } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { ConfirmButton, ListState, PageHeader, PaginationBar, StatusBadge } from "@/components/modules/common";
import { formatDate } from "@/utils/format.util";

export default function MyApplicationsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useMyApplications({ page, limit: 10, status: status || undefined, search: search || undefined });
  const { mutate: cancel, isPending } = useCancelApplication();
  const applications = data?.data ?? [];

  return (
    <div>
      <PageHeader title="My Applications" action={<Button render={<Link href="/properties" />}>Browse properties</Button>} />
      <div className="mb-4 flex flex-wrap gap-3">
        <Input className="w-64" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <NativeSelect className="w-44" value={status} onChange={(e) => { setStatus(e.target.value as ApplicationStatus | ""); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </NativeSelect>
      </div>
      <ListState isLoading={isLoading} error={error} isEmpty={!applications.length} emptyText="No applications yet.">
        <div className="space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{applicationTitle(a)}</p>
                <p className="text-sm text-muted-foreground">{roomLabel(a.room)} · {formatDate(a.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge value={a.status} />
                {a.status === "ACCEPTED" && <Button size="sm" render={<Link href="/dashboard/payments" />}>Pay</Button>}
                {a.status === "PENDING" && (
                  <ConfirmButton
                    size="sm"
                    variant="destructive"
                    title="Cancel this application?"
                    confirmLabel="Cancel application"
                    pending={isPending}
                    onConfirm={() => cancel(a.id, { onSuccess: () => toast.success("Application cancelled"), onError: (e) => toast.error(getErrorMessage(e)) })}
                  >
                    Cancel
                  </ConfirmButton>
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
