"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateMaintenance,
  useCurrentUser,
  useDeleteMaintenance,
  useMaintenanceRequests,
  useUpdateMaintenance,
  useUpdateMaintenanceStatus,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { MaintenancePriority, MaintenanceRequest, MaintenanceStatus } from "@/types";
import { roomLabel } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  ConfirmButton,
  FileUpload,
  FormField,
  ListState,
  PageHeader,
  PaginationBar,
  RoomSelect,
  StatusBadge,
} from "@/components/modules/common";
import { formatDate, formatMoney, humanize, toIso } from "@/utils/format.util";

const STATUSES: MaintenanceStatus[] = ["OPEN", "IN_PROGRESS", "WAITING_PARTS", "WAITING_VENDOR", "RESOLVED", "CLOSED", "REJECTED"];
const PRIORITIES: MaintenancePriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const onError = (e: unknown) => toast.error(getErrorMessage(e));

function Images({ urls, onRemove }: { urls: string[]; onRemove?: (url: string) => void }) {
  if (!urls.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {urls.map((u) => (
        <div key={u} className="relative">
          <a href={u} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="attachment" className="size-16 rounded-md border object-cover" />
          </a>
          {onRemove && (
            <button type="button" aria-label="Remove image" className="absolute -right-1 -top-1 rounded-full bg-destructive px-1 text-xs text-white" onClick={() => onRemove(u)}>
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function CreateDialog() {
  const { mutate, isPending } = useCreateMaintenance();
  const [open, setOpen] = useState(false);
  const empty = { roomId: "", title: "", description: "", category: "", priority: "MEDIUM", images: [] as string[] };
  const [form, setForm] = useState(empty);

  const submit = () =>
    mutate(
      { ...form, images: form.images.length ? form.images : undefined },
      {
        onSuccess: () => {
          toast.success("Request submitted");
          setOpen(false);
          setForm(empty);
        },
        onError,
      },
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>+ New Request</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Maintenance Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <FormField label="Room"><RoomSelect value={form.roomId} onChange={(roomId) => setForm({ ...form, roomId })} /></FormField>
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder="Describe the issue" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="Category (e.g. Plumbing)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <NativeSelect value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{humanize(p)}</option>)}
          </NativeSelect>
          <div className="space-y-2">
            <Images urls={form.images} onRemove={(u) => setForm({ ...form, images: form.images.filter((x) => x !== u) })} />
            {form.images.length < 5 && (
              <FileUpload folder="maintenance" accept="image/*" multiple label="Attach photos" onUploaded={(urls) => setForm({ ...form, images: [...form.images, ...urls].slice(0, 5) })} />
            )}
          </div>
          <Button onClick={submit} disabled={!form.title || !form.description || !form.roomId || !form.category || isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditDialog({ request, isTenant }: { request: MaintenanceRequest; isTenant: boolean }) {
  const { mutate, isPending } = useUpdateMaintenance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: request.title,
    description: request.description,
    category: request.category ?? "",
    priority: String(request.priority),
    assignedTo: request.assignedTo ?? "",
    estimatedCost: request.estimatedCost?.toString() ?? "",
    actualCost: request.actualCost?.toString() ?? "",
    scheduledAt: request.scheduledAt ? request.scheduledAt.slice(0, 16) : "",
    images: request.images ?? [],
  });

  const submit = () =>
    mutate(
      {
        id: request.id,
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        images: form.images,
        ...(isTenant
          ? {}
          : {
              assignedTo: form.assignedTo || undefined,
              estimatedCost: form.estimatedCost ? Number(form.estimatedCost) : undefined,
              actualCost: form.actualCost ? Number(form.actualCost) : undefined,
              scheduledAt: toIso(form.scheduledAt),
            }),
      },
      { onSuccess: () => { toast.success("Request updated"); setOpen(false); }, onError },
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>Edit</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Request</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <NativeSelect value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{humanize(p)}</option>)}
          </NativeSelect>
          {!isTenant && (
            <>
              <FormField label="Assigned to"><Input value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} /></FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Estimated cost"><Input type="number" min={0} value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} /></FormField>
                <FormField label="Actual cost"><Input type="number" min={0} value={form.actualCost} onChange={(e) => setForm({ ...form, actualCost: e.target.value })} /></FormField>
              </div>
              <FormField label="Scheduled at"><Input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} /></FormField>
            </>
          )}
          <div className="space-y-2">
            <Images urls={form.images} onRemove={(u) => setForm({ ...form, images: form.images.filter((x) => x !== u) })} />
            {form.images.length < 5 && (
              <FileUpload folder="maintenance" accept="image/*" multiple label="Add photos" onUploaded={(urls) => setForm({ ...form, images: [...form.images, ...urls].slice(0, 5) })} />
            )}
          </div>
          <Button onClick={submit} disabled={isPending}>{isPending ? "Saving..." : "Save changes"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MaintenanceModule() {
  const { user } = useCurrentUser();
  const isTenant = user?.role === "TENANT";
  const canDelete = isTenant || user?.role === "ADMIN";
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<MaintenanceStatus | "">("");
  const [priority, setPriority] = useState<MaintenancePriority | "">("");
  const { data, isLoading, error } = useMaintenanceRequests({ page, limit: 10, status: status || undefined, priority: priority || undefined });
  const setReqStatus = useUpdateMaintenanceStatus();
  const remove = useDeleteMaintenance();
  const requests: MaintenanceRequest[] = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Maintenance" action={isTenant ? <CreateDialog /> : undefined} />
      <div className="mb-4 flex flex-wrap gap-3">
        <NativeSelect className="w-48" value={status} onChange={(e) => { setStatus(e.target.value as MaintenanceStatus | ""); setPage(1); }}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
        </NativeSelect>
        <NativeSelect className="w-48" value={priority} onChange={(e) => { setPriority(e.target.value as MaintenancePriority | ""); setPage(1); }}>
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{humanize(p)}</option>)}
        </NativeSelect>
      </div>
      <ListState isLoading={isLoading} error={error} isEmpty={!requests.length} emptyText="No maintenance requests yet.">
        <div className="space-y-3">
          {requests.map((m) => (
            <div key={m.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {[m.category, roomLabel(m.room), !isTenant && m.tenant?.name, formatDate(m.createdAt)].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-1 text-sm">{m.description}</p>
                  {(m.assignedTo || m.estimatedCost || m.actualCost) && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {m.assignedTo && `Assigned: ${m.assignedTo} · `}
                      {m.estimatedCost ? `Est. ${formatMoney(m.estimatedCost)} · ` : ""}
                      {m.actualCost ? `Actual ${formatMoney(m.actualCost)}` : ""}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge value={String(m.priority)} />
                  <StatusBadge value={String(m.status)} />
                </div>
              </div>
              <Images urls={m.images ?? []} />
              <div className="flex flex-wrap items-center gap-2">
                {!isTenant && (
                  <NativeSelect className="w-44" value={String(m.status)} onChange={(e) => setReqStatus.mutate({ id: m.id, status: e.target.value as MaintenanceStatus }, { onSuccess: () => toast.success("Status updated"), onError })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
                  </NativeSelect>
                )}
                {m.status !== "CLOSED" && <EditDialog request={m} isTenant={isTenant} />}
                {canDelete && (user?.role === "ADMIN" || m.status === "OPEN") && (
                  <ConfirmButton size="sm" variant="destructive" title="Delete this request?" confirmLabel="Delete" pending={remove.isPending} onConfirm={() => remove.mutate(m.id, { onSuccess: () => toast.success("Request deleted"), onError })}>
                    Delete
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
