"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useCreateMatch,
  useFindMatches,
  useRoommateMatches,
  useRoommatePreferences,
  useSavePreferences,
  useUpdateMatchStatus,
} from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import type { MatchItem, RoommatePreference } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FormField, ListState, PageHeader, StatusBadge } from "@/components/modules/common";
import { toIso } from "@/utils/format.util";

const onError = (e: unknown) => toast.error(getErrorMessage(e));

const emptyForm = {
  budgetMin: "",
  budgetMax: "",
  preferredCities: "",
  preferredAreas: "",
  lifestyle: "",
  cleanlinessLevel: "",
  noiseTolerance: "",
  smokingAllowed: false,
  petsAllowed: false,
  guestsFrequency: "",
  workSchedule: "",
  moveInDate: "",
  leaseDuration: "",
};

const csv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
const num = (s: string) => (s === "" ? undefined : Number(s));

function toForm(p?: RoommatePreference | null) {
  if (!p) return emptyForm;
  return {
    budgetMin: p.budgetMin?.toString() ?? "",
    budgetMax: p.budgetMax?.toString() ?? "",
    preferredCities: (p.preferredCities ?? []).join(", "),
    preferredAreas: (p.preferredAreas ?? []).join(", "),
    lifestyle: p.lifestyle ?? "",
    cleanlinessLevel: p.cleanlinessLevel?.toString() ?? "",
    noiseTolerance: p.noiseTolerance?.toString() ?? "",
    smokingAllowed: !!p.smokingAllowed,
    petsAllowed: !!p.petsAllowed,
    guestsFrequency: p.guestsFrequency ?? "",
    workSchedule: p.workSchedule ?? "",
    moveInDate: p.moveInDate?.slice(0, 10) ?? "",
    leaseDuration: p.leaseDuration?.toString() ?? "",
  };
}

function PreferencesForm() {
  const { data, isLoading } = useRoommatePreferences();
  // Mount the editor once data has loaded so its state starts from the saved prefs.
  return isLoading ? <Skeleton className="mb-8 h-64 w-full" /> : <PreferencesEditor initial={data?.data} />;
}

function PreferencesEditor({ initial }: { initial?: RoommatePreference | null }) {
  const { mutate: save, isPending } = useSavePreferences();
  const [form, setForm] = useState(() => toForm(initial));

  const submit = () =>
    save(
      {
        budgetMin: num(form.budgetMin),
        budgetMax: num(form.budgetMax),
        preferredCities: csv(form.preferredCities),
        preferredAreas: csv(form.preferredAreas),
        lifestyle: form.lifestyle || undefined,
        cleanlinessLevel: num(form.cleanlinessLevel),
        noiseTolerance: num(form.noiseTolerance),
        smokingAllowed: form.smokingAllowed,
        petsAllowed: form.petsAllowed,
        guestsFrequency: (form.guestsFrequency || undefined) as RoommatePreference["guestsFrequency"],
        workSchedule: (form.workSchedule || undefined) as RoommatePreference["workSchedule"],
        moveInDate: toIso(form.moveInDate),
        leaseDuration: num(form.leaseDuration),
      },
      {
        onSuccess: () => {
          toast.success("Preferences saved");
          // Reset form to empty after saving - will be populated from refetched preferences
          // on the next render when the query refetches and provides new initial data
          setForm(emptyForm as typeof form);
        },
        onError,
      },
    );

  const set = <K extends keyof typeof emptyForm>(k: K, v: (typeof emptyForm)[K]) => setForm({ ...form, [k]: v });

  return (
    <Card className="mb-8">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-lg font-semibold">Your Preferences</h2>
        {(
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Min budget (BDT)"><Input type="number" min={0} value={form.budgetMin} onChange={(e) => set("budgetMin", e.target.value)} /></FormField>
              <FormField label="Max budget (BDT)"><Input type="number" min={0} value={form.budgetMax} onChange={(e) => set("budgetMax", e.target.value)} /></FormField>
              <FormField label="Preferred cities" hint="Comma separated"><Input value={form.preferredCities} onChange={(e) => set("preferredCities", e.target.value)} /></FormField>
              <FormField label="Preferred areas" hint="Comma separated"><Input value={form.preferredAreas} onChange={(e) => set("preferredAreas", e.target.value)} /></FormField>
              <FormField label="Lifestyle"><Input placeholder="e.g. quiet, social" value={form.lifestyle} onChange={(e) => set("lifestyle", e.target.value)} /></FormField>
              <FormField label="Lease duration (months, 1–24)"><Input type="number" min={1} max={24} value={form.leaseDuration} onChange={(e) => set("leaseDuration", e.target.value)} /></FormField>
              <FormField label="Cleanliness (1–5)"><Input type="number" min={1} max={5} value={form.cleanlinessLevel} onChange={(e) => set("cleanlinessLevel", e.target.value)} /></FormField>
              <FormField label="Noise tolerance (1–5)"><Input type="number" min={1} max={5} value={form.noiseTolerance} onChange={(e) => set("noiseTolerance", e.target.value)} /></FormField>
              <FormField label="Guests">
                <NativeSelect value={form.guestsFrequency} onChange={(e) => set("guestsFrequency", e.target.value)}>
                  <option value="">No preference</option>
                  <option value="rare">Rarely</option>
                  <option value="occasional">Occasionally</option>
                  <option value="frequent">Frequently</option>
                </NativeSelect>
              </FormField>
              <FormField label="Work schedule">
                <NativeSelect value={form.workSchedule} onChange={(e) => set("workSchedule", e.target.value)}>
                  <option value="">No preference</option>
                  <option value="day">Day</option>
                  <option value="night">Night</option>
                  <option value="shift">Shift</option>
                  <option value="remote">Remote</option>
                </NativeSelect>
              </FormField>
              <FormField label="Move-in date"><Input type="date" value={form.moveInDate} onChange={(e) => set("moveInDate", e.target.value)} /></FormField>
              <div className="flex items-center gap-6 text-sm sm:pt-6">
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.smokingAllowed} onChange={(e) => set("smokingAllowed", e.target.checked)} /> Smoking OK</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.petsAllowed} onChange={(e) => set("petsAllowed", e.target.checked)} /> Pets OK</label>
              </div>
            </div>
            <Button onClick={submit} disabled={isPending}>{isPending ? "Saving..." : "Save Preferences"}</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/** Fresh suggestions from POST /roommate/matches; each can be sent a match request. */
function Suggestions() {
  const { mutate: find, data, isPending } = useFindMatches();
  const { mutate: invite, isPending: inviting } = useCreateMatch();
  const suggestions: MatchItem[] = data?.data ?? [];
  const idOf = (m: MatchItem) => m.matchedWith?.id ?? m.matchedWithId ?? m.userId;
  const nameOf = (m: MatchItem) => m.matchedWith?.name ?? m.name ?? "Potential roommate";

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Find Roommates</h2>
        <Button variant="outline" disabled={isPending} onClick={() => find(undefined, { onSuccess: (r) => toast.success(`${r.data?.length ?? 0} potential roommates found`), onError })}>
          {isPending ? "Searching..." : "Find Matches"}
        </Button>
      </div>
      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((m, i) => {
            const id = idOf(m);
            return (
              <div key={`${id ?? "match"}-${i}`} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{nameOf(m)}</p>
                  {m.score !== undefined && <p className="text-sm text-muted-foreground">Compatibility {Math.round(m.score)}%</p>}
                </div>
                {id && m.id ? (
                  <StatusBadge value={m.status} />
                ) : id && (
                  <Button size="sm" disabled={inviting} onClick={() => invite({ matchedWithId: id }, { onSuccess: () => toast.success("Match request sent"), onError })}>
                    Send request
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function RoommatePage() {
  const { data, isLoading, error } = useRoommateMatches();
  const { mutate: respond, isPending } = useUpdateMatchStatus();
  const sent = (data?.data?.seekerMatches ?? []).map((m) => ({ m, incoming: false }));
  // A match with yourself (possible via the API) shows up in both lists; list it once, as sent.
  const received = (data?.data?.potentialMatches ?? [])
    .filter((m) => m.tenantId !== m.matchedWithId)
    .map((m) => ({ m, incoming: true }));
  const matches = [...received, ...sent].sort((a, b) => +new Date(b.m.createdAt ?? 0) - +new Date(a.m.createdAt ?? 0));

  return (
    <div>
      <PageHeader title="Roommate Matching" />
      <PreferencesForm />
      <Suggestions />

      <h2 className="mb-3 text-lg font-semibold">Your Matches</h2>
      <ListState isLoading={isLoading} error={error} isEmpty={!matches.length} emptyText="No matches yet. Save your preferences and find matches above.">
        <div className="space-y-3">
          {matches.map(({ m, incoming }) => {
            // Only the invited tenant can respond to a request.
            const other = incoming ? m.tenant : m.matchedWith;
            return (
              <div key={`${incoming ? "in" : "out"}-${m.id}`} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{other?.name ?? "Potential roommate"}</p>
                  <p className="text-sm text-muted-foreground">
                    {incoming ? "Sent you a request" : "You sent a request"}
                    {m.score !== undefined && ` · ${Math.round(m.score)}% match`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge value={m.status} />
                  {incoming && m.status === "INTERESTED" && (
                    <>
                      <Button size="sm" disabled={isPending} onClick={() => respond({ matchId: m.id, status: "CONNECTED" }, { onSuccess: () => toast.success("Connected!"), onError })}>Accept</Button>
                      <Button size="sm" variant="destructive" disabled={isPending} onClick={() => respond({ matchId: m.id, status: "REJECTED" }, { onSuccess: () => toast.success("Request declined"), onError })}>Decline</Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ListState>
    </div>
  );
}
