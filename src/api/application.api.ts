import apiClient from "@/lib/apiClient";

export function createApplication(payload: { roomId: string; message?: string }) {
  return apiClient("/applications", { method: "POST", body: payload });
}

export function getMyApplications() {
  return apiClient("/applications/my-applications");
}

export function getLandlordApplications() {
  return apiClient("/applications/landlord");
}

export function updateApplicationStatus(id: string, status: "ACCEPTED" | "REJECTED") {
  return apiClient(`/applications/${id}/status`, { method: "PATCH", body: { status } });
}

export function cancelApplication(id: string) {
  return apiClient(`/applications/${id}/cancel`, { method: "PATCH" });
}
