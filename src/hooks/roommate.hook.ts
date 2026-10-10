import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMatch, findMatches, getMyMatches, getMyPreferences, savePreferences, updateMatchStatus } from "@/api";
import type { MatchStatus } from "@/types";

export function useRoommatePreferences() {
  return useQuery({ queryKey: ["roommate-prefs"], queryFn: getMyPreferences, retry: false });
}

export function useSavePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: savePreferences,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roommate-prefs"] }),
  });
}

export function useRoommateMatches() {
  return useQuery({ queryKey: ["roommate-matches"], queryFn: getMyMatches });
}

/** Computes fresh matches; the result is returned (not cached) so callers can show suggestions. */
export function useFindMatches() {
  return useMutation({ mutationFn: (payload: { roomId?: string } | void) => findMatches(payload ?? {}) });
}

export function useCreateMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ matchedWithId, roomId }: { matchedWithId: string; roomId?: string }) =>
      createMatch(matchedWithId, roomId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roommate-matches"] }),
  });
}

export function useUpdateMatchStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ matchId, status }: { matchId: string; status: Extract<MatchStatus, "INTERESTED" | "CONNECTED" | "REJECTED"> }) =>
      updateMatchStatus(matchId, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roommate-matches"] }),
  });
}
