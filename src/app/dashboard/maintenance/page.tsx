"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { api, getErrorMessage, type ApiSuccess } from "@/lib/api";
import type { MaintenanceRequest } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function MaintenancePage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["my-maintenance"],
    queryFn: async () => (await api.get<ApiSuccess<MaintenanceRequest[]>>("/maintenance")).data.data,
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", roomId: "", priority: "MEDIUM" });
  const rooms = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => (await api.get<ApiSuccess<{ id: string; name: string }[]>>("/rooms")).data.data,
    enabled: open,
  });

  const create = useMutation({
    mutationFn: async () => api.post("/maintenance", form),
    onSuccess: () => { toast.success("Request submitted"); setOpen(false); setForm({ title: "", description: "", category: "", roomId: "", priority: "MEDIUM" }); qc.invalidateQueries({ queryKey: ["my-maintenance"] }); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Maintenance</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>+ New Request</DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Maintenance Request</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Describe the issue" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <select className="h-9 w-full rounded-md border px-3 text-sm" value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })}>
                <option value="">Select your room...</option>
                {rooms.data?.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <Input placeholder="Category (e.g. Plumbing)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <select className="h-9 w-full rounded-md border px-3 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              <Button onClick={() => create.mutate()} disabled={!form.title || !form.description || !form.roomId || !form.category || create.isPending}>
                {create.isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {!data?.length ? (
        <p className="text-muted-foreground">No maintenance requests yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((m) => (
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
