"use client";

import { useState } from "react";
import { toast } from "sonner";
import { usePendingVerifications, useReviewVerification } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { PendingVerification } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ListState, PageHeader, PaginationBar, StatusBadge } from "@/components/modules/common";
import { formatDate } from "@/utils/format.util";

const onError = (e: unknown) => toast.error(getErrorMessage(e));

function ReviewDialog({ user }: { user: PendingVerification }) {
  const { mutate, isPending } = useReviewVerification();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const act = (action: "APPROVE" | "REJECT") =>
    mutate(
      { userId: user.id, action, notes: notes || undefined },
      { onSuccess: () => { toast.success(action === "APPROVE" ? "Tenant verified" : "Verification rejected"); setOpen(false); setNotes(""); }, onError },
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>Review</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {user.name}</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {user.verificationDocs?.length ? (
            <ul className="space-y-1 text-sm">
              {user.verificationDocs.map((u, i) => (
                <li key={u}><a className="text-primary underline" href={u} target="_blank" rel="noreferrer">Document {i + 1}</a></li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No documents submitted.</p>
          )}
          <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <div className="flex gap-2">
            <Button disabled={isPending} onClick={() => act("APPROVE")}>Approve</Button>
            <Button variant="destructive" disabled={isPending} onClick={() => act("REJECT")}>Reject</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function VerificationsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [verified, setVerified] = useState<"" | "true" | "false">("false");
  const { data, isLoading, error } = usePendingVerifications({
    page,
    limit: 10,
    search: search || undefined,
    isVerified: verified === "" ? undefined : verified === "true",
  });
  const tenants: PendingVerification[] = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Tenant Verifications" description="Review identity documents submitted by tenants." />
      <div className="mb-4 flex flex-wrap gap-3">
        <Input className="w-64" placeholder="Search name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <NativeSelect className="w-44" value={verified} onChange={(e) => { setVerified(e.target.value as typeof verified); setPage(1); }}>
          <option value="false">Not verified</option>
          <option value="true">Verified</option>
          <option value="">All tenants</option>
        </NativeSelect>
      </div>
      <ListState isLoading={isLoading} error={error} isEmpty={!tenants.length} emptyText="No tenants to review.">
        <div className="space-y-3">
          {tenants.map((t) => (
            <div key={t.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.email} · Joined {formatDate(t.createdAt)} · {t.verificationDocs?.length ?? 0} document(s)</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge value={t.isVerified ? "APPROVED" : t.verificationDocs?.length ? "PENDING" : "OPEN"} />
                <ReviewDialog user={t} />
              </div>
            </div>
          ))}
        </div>
        <PaginationBar meta={data?.meta} onPageChange={setPage} />
      </ListState>
    </div>
  );
}
