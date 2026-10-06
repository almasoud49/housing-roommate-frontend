import apiClient from "@/lib/apiClient";

export function getMyPreferences() {
  return apiClient("/roommate/preferences");
}

export function savePreferences(payload: Record<string, unknown>) {
  return apiClient("/roommate/preferences", { method: "POST", body: payload });
}

export function getMyMatches() {
  return apiClient("/roommate/matches");
}

export function findMatches() {
  return apiClient("/roommate/matches", { method: "POST", body: {} });
}
