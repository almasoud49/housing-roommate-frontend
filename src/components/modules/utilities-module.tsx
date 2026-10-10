"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useBills,
  useCreateBill,
  useCurrentUser,
  useDeleteBill,
  useLandlordApplications,
  useMyBills,
  usePaySplit,
  useUpdateBill,
  useUpdateBillStatus,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { UtilityBill, UtilityBillStatus, UtilityType } from "@/types";
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

const TYPES: UtilityType[] = ["ELECTRICITY", "WATER", "GAS", "INTERNET", "TRASH", "OTHER"];
const STATUSES: UtilityBillStatus[] = ["PENDING", "PAID", "PARTIAL", "OVERDUE"];
const onError = (e: unknown) => toast.error(getErrorMessage(e));

/* ----------------------------- Tenant view ----------------------------- */

function TenantBills() {
  const { data, isLoading, error } = useMyBills();
  const pay = usePaySplit();
  const splits = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Utility Bills" description="Your share of each utility bill." />
      <ListState isLoading={isLoading} error={error} isEmpty={!splits.length} emptyText="You have no utility bills.">
        <div className="space-y-3">
          {splits.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{humanize(s.utilityBill?.type)} bill</p>
                <p className="text-sm text-muted-foreground">
                  Your share {formatMoney(s.amount, s.utilityBill?.currency)} of {formatMoney(s.utilityBill?.amount, s.utilityBill?.currency)} · Due {formatDate(s.utilityBill?.dueDate)}
                </p>
                {s.paidDate && <p className="text-xs text-muted-foreground">Paid {formatDate(s.paidDate)}</p>}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge value={s.status} />
                {s.status !== "PAID" && (
                  <Button size="sm" disabled={pay.isPending} onClick={() => pay.mutate(s.id, { onSuccess: () => toast.success("Marked as paid"), onError })}>
                    Mark paid
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ListState>
    </div>
  );
}

/* ---------------------------- Landlord view ---------------------------- */

function CreateBillDialog() {
  const { mutate, isPending } = useCreateBill();
  const { data: apps } = useLandlordApplications({ status: "ACCEPTED", limit: 50 });
  const [open, setOpen] = useState(false);
  const empty = { roomId: "", type: "ELECTRICITY" as UtilityType, amount: "", billingPeriod: "", dueDate: "", billUrl: "", notes: "" };
  const [form, setForm] = useState(empty);
  const [splitAmounts, setSplitAmounts] = useState<Record<string, string>>({});

  const tenants = useMemo(() => {
    const seen = new Map<string, string>();
    for (const a of apps?.data ?? []) {
      if (a.room?.id === form.roomId && a.tenant) seen.set(a.tenant.id, a.tenant.name);
    }
    return [...seen.entries()].map(([id, name]) => ({ id, name }));
  }, [apps, form.roomId]);

  const total = Number(form.amount) || 0;
  const equalShare = tenants.length ? Math.round((total / tenants.length) * 100) / 100 : 0;
  const amountFor = (id: string) => (splitAmounts[id] !== undefined ? Number(splitAmounts[id]) || 0 : equalShare);
  const splitSum = tenants.reduce((sum, t) => sum + amountFor(t.id), 0);
  const balanced = Math.abs(splitSum - total) < 0.01;

  const submit = () => {
    const billingPeriod = toIso(form.billingPeriod);
    const dueDate = toIso(form.dueDate);
    if (!form.roomId || !total || !billingPeriod || !dueDate) return toast.error("Room, amount, billing period and due date are required");
    if (!tenants.length) return toast.error("This room has no accepted tenants to split the bill with");
    if (!balanced) return toast.error("Split amounts must add up to the bill amount");
    mutate(
      {
        roomId: form.roomId,
        type: form.type,
        amount: total,
        billingPeriod,
        dueDate,
        billUrl: form.billUrl || undefined,
        notes: form.notes || undefined,
        splits: tenants.map((t) => ({ tenantId: t.id, amount: amountFor(t.id) })),
      },
      {
        onSuccess: () => { toast.success("Bill created"); setOpen(false); setForm(empty); setSplitAmounts({}); },
        onError,
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>+ New Bill</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Utility Bill</DialogTitle></DialogHeader>
        <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          <FormField label="Room"><RoomSelect value={form.roomId} onChange={(roomId) => { setForm({ ...form, roomId }); setSplitAmounts({}); }} /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Type">
              <NativeSelect value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as UtilityType })}>
                {TYPES.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}
              </NativeSelect>
            </FormField>
            <FormField label="Amount (BDT)"><Input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></FormField>
            <FormField label="Billing period"><Input type="date" value={form.billingPeriod} onChange={(e) => setForm({ ...form, billingPeriod: e.target.value })} /></FormField>
            <FormField label="Due date"><Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></FormField>
          </div>
          <FormField label="Notes"><Textarea maxLength={500} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></FormField>
          <div className="flex items-center gap-3 text-sm">
            <FileUpload folder="documents" resourceType="auto" label="Attach bill" onUploaded={([url]) => setForm({ ...form, billUrl: url })} />
            {form.billUrl && <a className="text-primary underline" href={form.billUrl} target="_blank" rel="noreferrer">View attachment</a>}
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">Split between tenants</p>
            {!form.roomId ? (
              <p className="text-sm text-muted-foreground">Select a room first.</p>
            ) : !tenants.length ? (
              <p className="text-sm text-muted-foreground">No accepted tenants for this room.</p>
            ) : (
              <div className="space-y-2">
                {tenants.map((t) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <span className="flex-1 text-sm">{t.name}</span>
                    <Input className="w-32" type="number" min={0} value={splitAmounts[t.id] ?? (total ? String(equalShare) : "")} onChange={(e) => setSplitAmounts({ ...splitAmounts, [t.id]: e.target.value })} />
                  </div>
                ))}
                {!balanced && total > 0 && <p className="text-xs text-destructive">Splits total {splitSum} but the bill is {total}.</p>}
              </div>
            )}
          </div>
          <Button onClick={submit} disabled={isPending}>{isPending ? "Creating..." : "Create Bill"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditBillDialog({ bill }: { bill: UtilityBill }) {
  const { mutate, isPending } = useUpdateBill();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: bill.type, amount: String(bill.amount), dueDate: bill.dueDate.slice(0, 10), notes: bill.notes ?? "" });

  const submit = () =>
    mutate(
      { id: bill.id, type: form.type, amount: Number(form.amount), dueDate: toIso(form.dueDate), notes: form.notes || undefined },
      { onSuccess: () => { toast.success("Bill updated"); setOpen(false); }, onError },
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>Edit</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Bill</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <NativeSelect value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as UtilityType })}>
            {TYPES.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}
          </NativeSelect>
          <FormField label="Amount" hint="Changing the amount does not change existing splits."><Input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></FormField>
          <FormField label="Due date"><Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></FormField>
          <FormField label="Notes"><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></FormField>
          <Button onClick={submit} disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ManagerBills({ canDelete }: { canDelete: boolean }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<UtilityBillStatus | "">("");
  const [type, setType] = useState<UtilityType | "">("");
  const { data, isLoading, error } = useBills({ page, limit: 10, status: status || undefined, type: type || undefined });
  const setBillStatus = useUpdateBillStatus();
  const remove = useDeleteBill();
  const bills = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Utility Bills" action={<CreateBillDialog />} />
      <div className="mb-4 flex flex-wrap gap-3">
        <NativeSelect className="w-44" value={status} onChange={(e) => { setStatus(e.target.value as UtilityBillStatus | ""); setPage(1); }}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
        </NativeSelect>
        <NativeSelect className="w-44" value={type} onChange={(e) => { setType(e.target.value as UtilityType | ""); setPage(1); }}>
          <option value="">All types</option>
          {TYPES.map((t) => <option key={t} value={t}>{humanize(t)}</option>)}
        </NativeSelect>
      </div>
      <ListState isLoading={isLoading} error={error} isEmpty={!bills.length} emptyText="No utility bills yet.">
        <div className="space-y-3">
          {bills.map((b) => (
            <div key={b.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{humanize(b.type)} · {formatMoney(b.amount, b.currency)}</p>
                  <p className="text-sm text-muted-foreground">{roomLabel(b.room)} · Due {formatDate(b.dueDate)}</p>
                  {b.notes && <p className="text-sm text-muted-foreground">{b.notes}</p>}
                  {b.billUrl && <a className="text-sm text-primary underline" href={b.billUrl} target="_blank" rel="noreferrer">View bill</a>}
                </div>
                <StatusBadge value={b.status} />
              </div>
              {!!b.splits?.length && (
                <ul className="space-y-1 text-sm">
                  {b.splits.map((s) => (
                    <li key={s.id} className="flex justify-between">
                      <span>{s.tenant?.name ?? "Tenant"}</span>
                      <span className="flex items-center gap-2">{formatMoney(s.amount, b.currency)} <StatusBadge value={s.status} /></span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap items-center gap-2">
                {b.status !== "PAID" && (
                  <>
                    <NativeSelect className="w-40" value={b.status} onChange={(e) => setBillStatus.mutate({ id: b.id, status: e.target.value as UtilityBillStatus }, { onSuccess: () => toast.success("Status updated"), onError })}>
                      {STATUSES.map((s) => <option key={s} value={s}>{humanize(s)}</option>)}
                    </NativeSelect>
                    <EditBillDialog bill={b} />
                  </>
                )}
                {canDelete && (
                  <ConfirmButton size="sm" variant="destructive" title="Delete this bill?" confirmLabel="Delete" pending={remove.isPending} onConfirm={() => remove.mutate(b.id, { onSuccess: () => toast.success("Bill deleted"), onError })}>
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

export default function UtilitiesModule() {
  const { user } = useCurrentUser();
  if (!user) return null;
  if (user.role === "TENANT") return <TenantBills />;
  // Backend: only LANDLORD and ADMIN may delete bills.
  return <ManagerBills canDelete={user.role === "LANDLORD" || user.role === "ADMIN"} />;
}
