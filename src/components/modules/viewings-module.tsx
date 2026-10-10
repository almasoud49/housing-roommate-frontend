"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateViewing,
  useCurrentUser,
  useDeleteViewing,
  useUpdateViewingStatus,
  useViewings,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { ViewingRequest, ViewingStatus } from "@/types";
import { roomLabel } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  ConfirmButton,
  FormField,
  ListState,
  PageHeader,
  PaginationBar,
  RoomSelect,
  StatusBadge,
} from "@/components/modules/common";
import { formatDate, toIso } from "@/utils/format.util";

const STATUSES: ViewingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];
const onError = (e: unknown) => toast.error(getErrorMessage(e));

function NewViewingDialog() {
  const { mutate, isPending } = useCreateViewing();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ roomId: "", date: "", time: "", notes: "" });

  const submit = () => {
    const preferredDate = toIso(form.date);
    if (!form.roomId || !preferredDate || !form.time) return toast.error("Room, date and time are required");
    if (new Date(`${form.date}T${form.time}`).getTime() < Date.now()) return toast.error("Preferred date must be in the future");
    mutate(
      { roomId: form.roomId, preferredDate, preferredTime: form.time, notes: form.notes || undefined },
      {
        onSuccess: () => {
          toast.success("Viewing requested");
          setOpen(false);
          setForm({ roomId: "", date: "", time: "", notes: "" });
        },
        onError,
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>+ Request Viewing</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a Viewing</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <FormField label="Room">
            <RoomSelect value={form.roomId} onChange={(roomId) => setForm({ ...form, roomId })} activeOnly />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Preferred date">
              <Input type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </FormField>
            <FormField label="Preferred time">
              <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Notes (optional)">
            <Textarea maxLength={500} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </FormField>
          <Button onClick={submit} disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ViewingsModule() {
  const { user } = useCurrentUser();
  const isTenant = user?.role === "TENANT";
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ViewingStatus | "">("");
  const { data, isLoading, error } = useViewings({ page, limit: 10, status: status || undefined });
  const setViewingStatus = useUpdateViewingStatus();
  const remove = useDeleteViewing();
  const viewings: ViewingRequest[] = data?.data ?? [];

  const change = (id: string, s: Exclude<ViewingStatus, "PENDING">) =>
    setViewingStatus.mutate({ id, status: s }, { onSuccess: () => toast.success(`Marked ${s.toLowerCase().replace("_", " ")}`), onError });

  return (
    <div>
      <PageHeader title="Viewing Requests" action={isTenant ? <NewViewingDialog /> : undefined} />
      <NativeSelect className="mb-4 w-48" value={status} onChange={(e) => { setStatus(e.target.value as ViewingStatus | ""); setPage(1); }}>
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.replace("_", " ")}</option>
        ))}
      </NativeSelect>
      <ListState isLoading={isLoading} error={error} isEmpty={!viewings.length} emptyText="No viewing requests yet.">
        <div className="space-y-3">
          {viewings.map((v) => (
            <div key={v.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{roomLabel(v.room) || v.property?.title || "Room"}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(v.preferredDate ?? v.scheduledAt ?? v.createdAt)}
                  {v.preferredTime ? ` at ${v.preferredTime}` : ""}
                  {!isTenant && v.tenant ? ` · ${v.tenant.name}` : ""}
                </p>
                {v.notes && <p className="text-sm text-muted-foreground">“{v.notes}”</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={v.status} />
                {!isTenant && v.status === "PENDING" && (
                  <>
                    <Button size="sm" onClick={() => change(v.id, "CONFIRMED")}>Confirm</Button>
                    <Button size="sm" variant="destructive" onClick={() => change(v.id, "CANCELLED")}>Decline</Button>
                  </>
                )}
                {!isTenant && v.status === "CONFIRMED" && (
                  <>
                    <Button size="sm" onClick={() => change(v.id, "COMPLETED")}>Completed</Button>
                    <Button size="sm" variant="outline" onClick={() => change(v.id, "NO_SHOW")}>No-show</Button>
                    <Button size="sm" variant="destructive" onClick={() => change(v.id, "CANCELLED")}>Cancel</Button>
                  </>
                )}
                {isTenant && v.status === "PENDING" && (
                  <ConfirmButton
                    size="sm"
                    variant="destructive"
                    title="Cancel this viewing request?"
                    confirmLabel="Cancel request"
                    pending={remove.isPending}
                    onConfirm={() => remove.mutate(v.id, { onSuccess: () => toast.success("Viewing cancelled"), onError })}
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
