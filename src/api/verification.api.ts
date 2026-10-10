import apiClient from "@/lib/apiClient";
import type { AdminUser, ApiResponse, ListResponse, VerificationStatus } from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface VerificationFilters extends ListParams {
  status?: "ACTIVE" | "BLOCKED";
  isVerified?: boolean;
  search?: string;
  sortBy?: "createdAt" | "name" | "email";
}

export type PendingVerification = AdminUser & { verificationDocs?: string[] };

/** Tenant: submit 1–5 uploaded document URLs. */
export function uploadVerificationDocs(documents: string[]) {
  return apiClient<ApiResponse<unknown>>("/verification/documents", { method: "POST", body: { documents } });
}

export function getMyVerificationStatus() {
  return apiClient<ApiResponse<VerificationStatus>>("/verification/my-status");
}

/** Admin: tenants awaiting review. */
export function getPendingVerifications(params: VerificationFilters = {}) {
  return apiClient<ListResponse<PendingVerification>>(`/verification/pending${buildQuery(params)}`);
}

export function reviewVerification(payload: { userId: string; action: "APPROVE" | "REJECT"; notes?: string }) {
  return apiClient<ApiResponse<unknown>>("/verification/review", { method: "PATCH", body: payload });
}
