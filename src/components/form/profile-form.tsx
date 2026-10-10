"use client";

import { useUserProfile, useUpdateUserProfile } from "@/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/apiClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileUpload } from "@/components/modules/common";

export default function ProfileForm() {
  const { data, isLoading } = useUserProfile();
  if (isLoading) return <Skeleton className="h-64 w-full" />;
  return <ProfileEditor me={data?.data} />;
}

interface Me {
  name?: string;
  email?: string;
  profile?: { bio?: string; phoneNumber?: string; avatarUrl?: string; preferences?: string };
}

function ProfileEditor({ me }: { me?: Me }) {
  const { mutate: update, isPending } = useUpdateUserProfile();
  const [form, setForm] = useState({
    bio: me?.profile?.bio ?? "",
    phoneNumber: me?.profile?.phoneNumber ?? "",
    avatarUrl: me?.profile?.avatarUrl ?? "",
    preferences: me?.profile?.preferences ?? "",
  });

  // PATCH /users/me accepts only profile fields (phoneNumber, bio, avatarUrl, preferences).
  const save = (next = form) => {
    update(
      {
        phoneNumber: next.phoneNumber || undefined,
        bio: next.bio || undefined,
        avatarUrl: next.avatarUrl || undefined,
        preferences: next.preferences || undefined,
      },
      {
        onSuccess: () => toast.success("Profile updated"),
        onError: (e) => toast.error(getErrorMessage(e)),
      },
    );
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Profile & Settings</h1>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={form.avatarUrl || undefined} alt={me?.name} />
              <AvatarFallback>{me?.name?.charAt(0).toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
            <FileUpload
              folder="avatar"
              accept="image/*"
              label="Change photo"
              onUploaded={([url]) => {
                const next = { ...form, avatarUrl: url };
                setForm(next);
                save(next);
              }}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <Input value={me?.name ?? ""} disabled />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input value={me?.email ?? ""} disabled />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <Input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Preferences</label>
            <Textarea placeholder="Anything you'd like landlords or roommates to know" value={form.preferences} onChange={(e) => setForm({ ...form, preferences: e.target.value })} />
          </div>
          <Button onClick={() => save()} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
