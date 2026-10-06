"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useCreateApplication, useGetMe } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Room {
  id: string;
  name: string;
  price?: number;
  isActive: boolean;
}

export default function ApplyButton({ rooms }: { rooms: Room[] }) {
  const { data } = useGetMe();
  const user = data?.data;
  const { mutate: apply, isPending } = useCreateApplication();
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");

  if (!user) {
    return <Button render={<Link href="/login" />}>Login to Apply</Button>;
  }
  if (user.role !== "TENANT") {
    return <p className="text-sm text-muted-foreground">Only tenants can apply for rooms.</p>;
  }

  const submit = () => {
    apply(
      { roomId, message: message || undefined },
      {
        onSuccess: () => {
          toast.success("Application submitted!");
          setOpen(false);
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Apply Now</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for a Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <select className="h-9 w-full rounded-md border px-3 text-sm" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
            <option value="">Select a room...</option>
            {rooms
              .filter((r) => r.isActive)
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — ৳{r.price}/mo
                </option>
              ))}
          </select>
          <textarea
            className="w-full rounded-md border p-2 text-sm"
            placeholder="Message to the landlord (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={submit} disabled={!roomId || isPending}>
            {isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
