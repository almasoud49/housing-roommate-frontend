import apiClient from "@/lib/apiClient";

export function getRequests() {
  return apiClient("/maintenance");
}

export function createRequest(payload: {
  roomId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
}) {
  return apiClient("/maintenance", { method: "POST", body: payload });
}
