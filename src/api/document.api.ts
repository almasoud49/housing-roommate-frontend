import apiClient from "@/lib/apiClient";
import type { ApiResponse, DocumentStatus, DocumentType, ListResponse, RentalDocument } from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface DocumentFilters extends ListParams {
  applicationId?: string;
  type?: DocumentType;
  status?: DocumentStatus;
  sortBy?: "createdAt" | "expiresAt";
}

export interface CreateDocumentPayload {
  applicationId: string;
  type: DocumentType;
  title: string;
  fileUrl: string;
  /** ISO datetime */
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

export type UpdateDocumentPayload = Partial<Pick<CreateDocumentPayload, "title" | "fileUrl" | "expiresAt" | "metadata">>;

export function createDocument(payload: CreateDocumentPayload) {
  return apiClient<ApiResponse<RentalDocument>>("/documents", { method: "POST", body: payload });
}

export function getDocuments(params: DocumentFilters = {}) {
  return apiClient<ListResponse<RentalDocument>>(`/documents${buildQuery(params)}`);
}

export function getDocumentById(id: string) {
  return apiClient<ApiResponse<RentalDocument>>(`/documents/${id}`);
}

export function updateDocument(id: string, payload: UpdateDocumentPayload) {
  return apiClient<ApiResponse<RentalDocument>>(`/documents/${id}`, { method: "PATCH", body: payload });
}

export function updateDocumentStatus(
  id: string,
  status: Exclude<DocumentStatus, "DRAFT">,
) {
  return apiClient<ApiResponse<RentalDocument>>(`/documents/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function deleteDocument(id: string) {
  return apiClient<ApiResponse<null>>(`/documents/${id}`, { method: "DELETE" });
}
