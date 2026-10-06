"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Room {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
}

export function ApplyButton({ rooms }: { rooms: Room[] }) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <Button onClick={() => router.push("/login")}>Login to Apply</Button>
    );
  }
  if (user.role !== "TENANT") {
    return <p className="text-sm text-muted-foreground">Only tenants can apply for rooms.</p>;
  }

  const apply = async () => {
    setLoading(true);
    try {
      await api.post("/applications", { roomId, message: message || undefined });
      toast.success("Application submitted!");
      setOpen(false);
      router.push("/dashboard/applications");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Apply Now</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Apply for a Room</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <select className="h-9 w-full rounded-md border px-3 text-sm" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
            <option value="">Select a room...</option>
            {rooms.filter((r) => r.isActive).map((r) => (
              <option key={r.id} value={r.id}>{r.name} — ৳{r.price}/mo</option>
            ))}
          </select>
          <Textarea placeholder="Message to the landlord (optional)" value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button onClick={apply} disabled={!roomId || loading}>{loading ? "Submitting..." : "Submit Application"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
