"use client";

import { useUserProfile, useUpdateUserProfile } from "@/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileForm() {
  const { data, isLoading } = useUserProfile();
  const { mutate: update, isPending } = useUpdateUserProfile();
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", bio: "", phoneNumber: "" });

  useEffect(() => {
    const me = data?.data;
    if (me) {
      setForm({
        name: me.name ?? "",
        bio: me.profile?.bio ?? "",
        phoneNumber: me.profile?.phoneNumber ?? "",
      });
    }
  }, [data]);

  const save = () => {
    update(
      { name: form.name, profile: { bio: form.bio, phoneNumber: form.phoneNumber } },
      {
        onSuccess: () => {
          toast.success("Profile updated");
          qc.invalidateQueries({ queryKey: ["me-profile"] });
        },
        onError: (e) => toast.error(getErrorMessage(e)),
      },
    );
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Profile & Settings</h1>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input value={data?.data?.email ?? ""} disabled />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <Input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <Button onClick={save} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
