import apiClient from "@/lib/apiClient";

export function getProperties(params: {
  search?: string;
  city?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && sp.set(k, v));
  return apiClient(`/properties?${sp.toString()}`);
}

export function getPropertyById(id: string) {
  return apiClient(`/properties/${id}`);
}

export function getMyProperties() {
  return apiClient("/properties/my-properties");
}

export function createProperty(payload: {
  title: string;
  description: string;
  address: string;
  city: string;
}) {
  return apiClient("/properties", { method: "POST", body: payload });
}
