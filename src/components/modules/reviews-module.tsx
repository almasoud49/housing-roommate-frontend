"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateReview,
  useCurrentUser,
  useLandlordApplications,
  useMyApplications,
  useReviews,
  useRoommateMatches,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import { applicationTitle } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, ListState, PageHeader, PaginationBar } from "@/components/modules/common";
import { formatDate } from "@/utils/format.util";

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onChange} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => onChange?.(n)}>
          <Star className={`size-5 ${n <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
}

function WriteReviewDialog({ options }: { options: { id: string; label: string }[] }) {
  const { mutate, isPending } = useCreateReview();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ revieweeId: "", rating: 5, comment: "" });

  const submit = () =>
    mutate(
      { revieweeId: form.revieweeId, rating: form.rating, comment: form.comment || undefined },
      { onSuccess: () => { toast.success("Review submitted"); setOpen(false); setForm({ revieweeId: "", rating: 5, comment: "" }); }, onError: (e) => toast.error(getErrorMessage(e)) },
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>+ Write Review</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Write a Review</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <FormField label="Who are you reviewing?" hint={options.length ? undefined : "You can review people you've interacted with (applications, roommate matches)."}>
            <NativeSelect value={form.revieweeId} onChange={(e) => setForm({ ...form, revieweeId: e.target.value })}>
              <option value="">Select a person...</option>
              {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </NativeSelect>
          </FormField>
          <FormField label="Rating"><Stars value={form.rating} onChange={(rating) => setForm({ ...form, rating })} /></FormField>
          <FormField label="Comment (optional)"><Textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} /></FormField>
          <Button onClick={submit} disabled={isPending || !form.revieweeId}>{isPending ? "Submitting..." : "Submit Review"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ReviewsModule() {
  const { user } = useCurrentUser();
  const isTenant = user?.role === "TENANT";
  const isAdmin = user?.role === "ADMIN";
  const [page, setPage] = useState(1);
  const [scope, setScope] = useState<"all" | "about-me">("all");
  const { data, isLoading, error } = useReviews({ page, limit: 10, revieweeId: scope === "about-me" ? user?.id : undefined });
  const myApps = useMyApplications({ limit: 50 }, isTenant);
  const landlordApps = useLandlordApplications({ limit: 50 }, !!user && !isTenant && !isAdmin);
  const matches = useRoommateMatches();

  const options = useMemo(() => {
    const map = new Map<string, string>();
    if (isTenant) {
      for (const a of myApps.data?.data ?? []) {
        const landlordId = a.room?.flat?.building?.property?.landlordId;
        if (landlordId) map.set(landlordId, `Landlord of ${applicationTitle(a)}`);
      }
      const mine = matches.data?.data;
      for (const m of mine?.seekerMatches ?? []) {
        if (m.status === "CONNECTED" && m.matchedWith?.id) map.set(m.matchedWith.id, `Roommate: ${m.matchedWith.name ?? "Tenant"}`);
      }
      for (const m of mine?.potentialMatches ?? []) {
        if (m.status === "CONNECTED" && m.tenant?.id) map.set(m.tenant.id, `Roommate: ${m.tenant.name ?? "Tenant"}`);
      }
    } else if (!isAdmin) {
      for (const a of landlordApps.data?.data ?? []) {
        if (a.tenant) map.set(a.tenant.id, `Tenant: ${a.tenant.name}`);
      }
    }
    map.delete(user?.id ?? "");
    return [...map.entries()].map(([id, label]) => ({ id, label }));
  }, [isTenant, isAdmin, myApps.data, landlordApps.data, matches.data, user?.id]);

  const reviews = data?.data ?? [];

  return (
    <div>
      <PageHeader title="Reviews" action={!isAdmin ? <WriteReviewDialog options={options} /> : undefined} />
      {!isAdmin && (
        <NativeSelect className="mb-4 w-48" value={scope} onChange={(e) => { setScope(e.target.value as typeof scope); setPage(1); }}>
          <option value="all">All reviews</option>
          <option value="about-me">About me</option>
        </NativeSelect>
      )}
      <ListState isLoading={isLoading} error={error} isEmpty={!reviews.length} emptyText="No reviews yet.">
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  <span className="font-medium">{r.reviewer?.name ?? "Someone"}</span>
                  <span className="text-muted-foreground"> reviewed </span>
                  <span className="font-medium">{r.reviewee?.name ?? "a user"}</span>
                </p>
                <Stars value={r.rating} />
              </div>
              {r.comment && <p className="mt-2 text-sm">{r.comment}</p>}
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
            </div>
          ))}
        </div>
        <PaginationBar meta={data?.meta} onPageChange={setPage} />
      </ListState>
    </div>
  );
}
