"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { api, getErrorMessage, type ApiSuccess } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function RoommatePage() {
  const qc = useQueryClient();
  const prefs = useQuery({
    queryKey: ["roommate-prefs"],
    queryFn: async () => {
      try {
        return (await api.get<ApiSuccess<unknown>>("/roommate/preferences")).data.data;
      } catch {
        return null;
      }
    },
    retry: false,
  });
  const matches = useQuery({
    queryKey: ["roommate-matches"],
    queryFn: async () => (await api.get<ApiSuccess<unknown[]>>("/roommate/matches")).data.data,
  });

  const [form, setForm] = useState({ budgetMin: "", budgetMax: "", lifestyle: "", smokingAllowed: false, petsAllowed: false });

  const savePrefs = useMutation({
    mutationFn: async () =>
      api.post("/roommate/preferences", {
        budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
        lifestyle: form.lifestyle || undefined,
        smokingAllowed: form.smokingAllowed,
        petsAllowed: form.petsAllowed,
      }),
    onSuccess: () => { toast.success("Preferences saved"); qc.invalidateQueries({ queryKey: ["roommate-prefs"] }); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const findMatches = useMutation({
    mutationFn: async () => api.post("/roommate/matches", {}),
    onSuccess: () => { toast.success("Matches updated"); qc.invalidateQueries({ queryKey: ["roommate-matches"] }); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Roommate Matching</h1>

      <h2 className="mb-3 text-lg font-semibold">Your Preferences</h2>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Input placeholder="Min budget (BDT)" type="number" value={form.budgetMin} onChange={(e) => setForm({ ...form, budgetMin: e.target.value })} />
        <Input placeholder="Max budget (BDT)" type="number" value={form.budgetMax} onChange={(e) => setForm({ ...form, budgetMax: e.target.value })} />
        <Input placeholder="Lifestyle (e.g. quiet, social)" value={form.lifestyle} onChange={(e) => setForm({ ...form, lifestyle: e.target.value })} />
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.smokingAllowed} onChange={(e) => setForm({ ...form, smokingAllowed: e.target.checked })} /> Smoking OK</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.petsAllowed} onChange={(e) => setForm({ ...form, petsAllowed: e.target.checked })} /> Pets OK</label>
        </div>
      </div>
      <div className="mb-10 flex gap-3">
        <Button onClick={() => savePrefs.mutate()} disabled={savePrefs.isPending}>Save Preferences</Button>
        <Button variant="outline" onClick={() => findMatches.mutate()} disabled={findMatches.isPending}>Find Matches</Button>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Your Matches</h2>
      {matches.isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : !matches.data?.length ? (
        <p className="text-muted-foreground">No matches yet. Save preferences and click Find Matches.</p>
      ) : (
        <div className="space-y-3">
          {(matches.data as { id: string; status?: string; matchedWith?: { name?: string } }[]).map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border p-4">
              <span>{m.matchedWith?.name ?? "Potential roommate"}</span>
              {m.status && <Badge variant="secondary">{m.status}</Badge>}
            </div>
          ))}
        </div>
      )}
      {prefs.isLoading && <Skeleton className="mt-4 h-8 w-40" />}
    </div>
  );
}
