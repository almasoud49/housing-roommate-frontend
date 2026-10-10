import apiClient from "@/lib/apiClient";
import type { ApiResponse, MatchItem, MatchStatus, MyMatches, RoommatePreference } from "@/types";

export function getMyPreferences() {
  return apiClient<ApiResponse<RoommatePreference | null>>("/roommate/preferences");
}

export function savePreferences(payload: RoommatePreference) {
  return apiClient<ApiResponse<RoommatePreference>>("/roommate/preferences", {
    method: "POST",
    body: payload,
  });
}

export function getMyMatches() {
  return apiClient<ApiResponse<MyMatches>>("/roommate/matches");
}

/** Compute fresh matches, optionally scoped to a room. */
export function findMatches(payload: { roomId?: string } = {}) {
  return apiClient<ApiResponse<MatchItem[]>>("/roommate/matches", { method: "POST", body: payload });
}

/** Send a match request to another tenant. */
export function createMatch(matchedWithId: string, roomId?: string) {
  return apiClient<ApiResponse<MatchItem>>(`/roommate/matches/${matchedWithId}`, {
    method: "POST",
    body: roomId ? { roomId } : {},
  });
}

/** Only the invited tenant can respond. */
export function updateMatchStatus(matchId: string, status: Extract<MatchStatus, "INTERESTED" | "CONNECTED" | "REJECTED">) {
  return apiClient<ApiResponse<MatchItem>>(`/roommate/matches/${matchId}/status`, {
    method: "PATCH",
    body: { status },
  });
}
