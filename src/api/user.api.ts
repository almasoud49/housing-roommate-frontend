import apiClient from "@/lib/apiClient";
import type { UpdateProfilePayload } from "@/types";

export function getUserProfile() {
  return apiClient("/users/me");
}

export function updateUserProfile(payload: UpdateProfilePayload) {
  return apiClient("/users/me", { method: "PATCH", body: payload });
}
