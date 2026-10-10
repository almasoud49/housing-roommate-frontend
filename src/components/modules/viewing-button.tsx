"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCreateViewing, useCurrentUser } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/modules/common";
import { toIso } from "@/utils/format.util";

interface Room {
  id: string;
  name: string;
  price?: number;
  isActive: boolean;
}

/** "Request a viewing" for tenants, shown next to ApplyButton on a property page. */
export default function ViewingButton({ rooms }: { rooms: Room[] }) {
  const { user } = useCurrentUser();
  const { mutate, isPending } = useCreateViewing();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ roomId: "", date: "", time: "", notes: "" });

  if (user?.role !== "TENANT") return null;

  const submit = () => {
    const preferredDate = toIso(form.date);
    if (!form.roomId || !preferredDate || !form.time) return toast.error("Room, date and time are required");
    if (new Date(`${form.date}T${form.time}`).getTime() < Date.now()) return toast.error("Preferred date must be in the future");
    mutate(
      { roomId: form.roomId, preferredDate, preferredTime: form.time, notes: form.notes || undefined },
      {
        onSuccess: () => { toast.success("Viewing requested! Track it in your dashboard."); setOpen(false); },
        onError: (e) => toast.error(getErrorMessage(e)),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>Request Viewing</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Request a Viewing</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <FormField label="Room">
            <NativeSelect value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })}>
              <option value="">Select a room...</option>
              {rooms.filter((r) => r.isActive).map((r) => <option key={r.id} value={r.id}>{r.name} — ৳{r.price}/mo</option>)}
            </NativeSelect>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Date"><Input type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></FormField>
            <FormField label="Time"><Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></FormField>
          </div>
          <FormField label="Notes (optional)"><Textarea maxLength={500} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></FormField>
          <Button onClick={submit} disabled={isPending}>{isPending ? "Submitting..." : "Submit Request"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
