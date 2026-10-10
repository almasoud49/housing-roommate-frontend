"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateDocument,
  useCurrentUser,
  useDeleteDocument,
  useDocuments,
  useLandlordApplications,
  useUpdateDocument,
  useUpdateDocumentStatus,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import { applicationTitle, type DocumentStatus, type DocumentType, type RentalDocument } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConfirmButton, FileUpload, FormField, ListState, PageHeader, PaginationBar, StatusBadge } from "@/components/modules/common";
import { formatDate, humanize, toIso } from "@/utils/format.util";

const TYPES: DocumentType[] = ["LEASE_AGREEMENT", "MOVE_IN_CHECKLIST", "MOVE_OUT_CHECKLIST", "ID_DOCUMENT", "INCOME_PROOF", "REFERENCE_LETTER", "INSURANCE", "OTHER"];
const STATUSES: DocumentStatus[] = ["DRAFT", "PENDING_SIGNATURE", "SIGNED", "EXPIRED", "REVOKED"];
const SETTABLE: Exclude<DocumentStatus, "DRAFT">[] = ["PENDING_SIGNATURE", "SIGNED", "EXPIRED", "REVOKED"];
/** A draft can only be sent for signature or revoked. */
const DRAFT_NEXT: Exclude<DocumentStatus, "DRAFT">[] = ["PENDING_SIGNATURE", "REVOKED"];
/** Signed documents are immutable: no edit, status change or delete. */
const signed = (d: RentalDocument) => d.status === "SIGNED";
const onError = (e: unknown) => toast.error(getErrorMessage(e));

function CreateDialog() {
  const { mutate, isPending } = useCreateDocument();
  const { data: apps } = useLandlordApplications({ status: "ACCEPTED", limit: 50 });
  const [open, setOpen] = useState(false);
  const empty = { applicationId: "", type: "LEASE_AGREEMENT" as DocumentType, title: "", fileUrl: "", expiresAt: "" };
  const [form, setForm] = useState(empty);

  const submit = () =>
    mutate(
      { applicationId: form.applicationId, type: form.type, title: form.title, fileUrl: form.fileUrl, expiresAt: toIso(form.expiresAt) },
      { onSuccess: () => { toast.success("Document created"); setOpen(false); setForm(empty); }, onError },
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>+ New Document</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Document</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <FormField label="Application (accepted)">
            <NativeSelect value={form.applicationId} onChange={(e) => setForm({ ...form, applicationId: e.target.value })}>
              <option value="">Select an application...</option>
              {(apps?.data ?? []).map((a) => (
                <option key={a.id} value={a.id}>{a.tenant?.name ?? "Tenant"} — {applicationTitle(a)}</option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField label="Type">
            <NativeSelect value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DocumentType })}>
              {TYPES.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}
            </NativeSelect>
          </FormField>
          <FormField label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Expires (optional)"><Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} /></FormField>
          <div className="flex items-center gap-3 text-sm">
            <FileUpload folder="documents" resourceType="auto" label="Upload file" onUploaded={([url]) => setForm({ ...form, fileUrl: url })} />
            {form.fileUrl && <span className="text-green-600">File attached ✓</span>}
          </div>
          <Button onClick={submit} disabled={isPending || !form.applicationId || !form.title || !form.fileUrl}>
            {isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditDialog({ doc }: { doc: RentalDocument }) {
  const { mutate, isPending } = useUpdateDocument();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: doc.title, fileUrl: doc.fileUrl, expiresAt: doc.expiresAt?.slice(0, 10) ?? "" });

  const submit = () =>
    mutate(
      { id: doc.id, title: form.title, fileUrl: form.fileUrl, expiresAt: toIso(form.expiresAt) },
      { onSuccess: () => { toast.success("Document updated"); setOpen(false); }, onError },
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>Edit</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Document</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <FormField label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Expires"><Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} /></FormField>
          <FileUpload folder="documents" resourceType="auto" label="Replace file" onUploaded={([url]) => setForm({ ...form, fileUrl: url })} />
          <Button onClick={submit} disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DocumentsModule() {
  const { user } = useCurrentUser();
  const isTenant = user?.role === "TENANT";
  const canManage = !!user && !isTenant;
  const canDelete = user?.role === "LANDLORD" || user?.role === "ADMIN";
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<DocumentStatus | "">("");
  const [type, setType] = useState<DocumentType | "">("");
  const { data, isLoading, error } = useDocuments({ page, limit: 10, status: status || undefined, type: type || undefined });
  const setDocStatus = useUpdateDocumentStatus();
  const remove = useDeleteDocument();
  const docs = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Documents" description={isTenant ? "Lease agreements and other documents shared with you." : undefined} action={canManage ? <CreateDialog /> : undefined} />
      <div className="mb-4 flex flex-wrap gap-3">
        <NativeSelect className="w-48" value={status} onChange={(e) => { setStatus(e.target.value as DocumentStatus | ""); setPage(1); }}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
        </NativeSelect>
        <NativeSelect className="w-52" value={type} onChange={(e) => { setType(e.target.value as DocumentType | ""); setPage(1); }}>
          <option value="">All types</option>
          {TYPES.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}
        </NativeSelect>
      </div>
      <ListState isLoading={isLoading} error={error} isEmpty={!docs.length} emptyText="No documents yet.">
        <div className="space-y-3">
          {docs.map((d) => (
            <div key={d.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{d.title}</p>
                <p className="text-sm text-muted-foreground">
                  {humanize(d.type)} · Created {formatDate(d.createdAt)}
                  {d.expiresAt ? ` · Expires ${formatDate(d.expiresAt)}` : ""}
                  {d.signedAt ? ` · Signed ${formatDate(d.signedAt)}` : ""}
                </p>
                <a className="text-sm text-primary underline" href={d.fileUrl} target="_blank" rel="noreferrer">Open file</a>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={d.status} />
                {isTenant && d.status === "PENDING_SIGNATURE" && (
                  <Button size="sm" disabled={setDocStatus.isPending} onClick={() => setDocStatus.mutate({ id: d.id, status: "SIGNED" }, { onSuccess: () => toast.success("Document signed"), onError })}>
                    Sign
                  </Button>
                )}
                {canManage && !signed(d) && (
                  <>
                    <NativeSelect className="w-44" value={d.status === "DRAFT" ? "" : d.status} onChange={(e) => e.target.value && setDocStatus.mutate({ id: d.id, status: e.target.value as Exclude<DocumentStatus, "DRAFT"> }, { onSuccess: () => toast.success("Status updated"), onError })}>
                      {d.status === "DRAFT" && <option value="">Draft — set status…</option>}
                      {(d.status === "DRAFT" ? DRAFT_NEXT : SETTABLE).map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
                    </NativeSelect>
                    <EditDialog doc={d} />
                  </>
                )}
                {canDelete && !signed(d) && (
                  <ConfirmButton size="sm" variant="destructive" title="Delete this document?" confirmLabel="Delete" pending={remove.isPending} onConfirm={() => remove.mutate(d.id, { onSuccess: () => toast.success("Document deleted"), onError })}>
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
