import { useMutation, useQuery } from "@tanstack/react-query";
import { findMatches, getMyMatches, getMyPreferences, savePreferences } from "@/api";

export function useRoommatePreferences() {
  return useQuery({ queryKey: ["roommate-prefs"], queryFn: getMyPreferences, retry: false });
}

export function useSavePreferences() {
  return useMutation({ mutationFn: savePreferences });
}

export function useRoommateMatches() {
  return useQuery({ queryKey: ["roommate-matches"], queryFn: getMyMatches });
}

export function useFindMatches() {
  return useMutation({ mutationFn: findMatches });
}
