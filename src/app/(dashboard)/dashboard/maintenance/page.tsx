"use client";

import { useMaintenanceRequests, useCreateMaintenance } from "@/hooks";
import type { MaintenanceRequest } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";

export default function MaintenancePage() {
  const qc = useQueryClient();
  const { data, isLoading } = useMaintenanceRequests();
  const { mutate: create, isPending } = useCreateMaintenance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", roomId: "", priority: "MEDIUM" });
  const requests = data?.data as MaintenanceRequest[] | undefined;

  const submit = () => {
    create(form, {
      onSuccess: () => {
        toast.success("Request submitted");
        setOpen(false);
        setForm({ title: "", description: "", category: "", roomId: "", priority: "MEDIUM" });
        qc.invalidateQueries({ queryKey: ["maintenance"] });
      },
      onError: (e) => toast.error(getErrorMessage(e)),
    });
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Maintenance</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>+ New Request</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Maintenance Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Room ID (UUID)" value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })} />
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea className="w-full rounded-md border p-2 text-sm" placeholder="Describe the issue" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Category (e.g. Plumbing)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <select className="h-9 w-full rounded-md border px-3 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              <Button onClick={submit} disabled={!form.title || !form.description || !form.roomId || !form.category || isPending}>
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {!requests?.length ? (
        <p className="text-muted-foreground">No maintenance requests yet.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{m.title}</p>
                <p className="text-sm text-muted-foreground">{m.priority} · {new Date(m.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge variant="secondary">{m.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
