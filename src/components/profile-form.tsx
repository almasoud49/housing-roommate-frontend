"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, getErrorMessage, type ApiSuccess } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface Me {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: { phoneNumber?: string; bio?: string; avatarUrl?: string };
}

export function ProfileForm() {
  const qc = useQueryClient();
  const { user, setAuth, accessToken } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get<ApiSuccess<Me>>("/users/me")).data.data,
  });
  const [form, setForm] = useState({ name: "", bio: "", phoneNumber: "" });

  useEffect(() => {
    if (data) {
      setForm({ name: data.name ?? "", bio: data.profile?.bio ?? "", phoneNumber: data.profile?.phoneNumber ?? "" });
    }
  }, [data]);

  const update = useMutation({
    mutationFn: async () =>
      api.patch("/users/me", {
        name: form.name,
        profile: { bio: form.bio, phoneNumber: form.phoneNumber },
      }),
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["me"] });
      if (user && accessToken) setAuth(accessToken, { ...user, name: form.name });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Profile & Settings</h1>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input value={data?.email ?? ""} disabled />
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
          <Button onClick={() => update.mutate()} disabled={update.isPending}>
            {update.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
