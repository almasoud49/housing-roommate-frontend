import apiClient from "@/lib/apiClient";

export function getUserProfile() {
  return apiClient("/users/me");
}

export function updateUserProfile(payload: {
  name?: string;
  profile?: { bio?: string; phoneNumber?: string };
}) {
  return apiClient("/users/me", { method: "PATCH", body: payload });
}
