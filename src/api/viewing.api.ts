import apiClient from "@/lib/apiClient";

export function getViewings() {
  return apiClient("/viewings");
}
