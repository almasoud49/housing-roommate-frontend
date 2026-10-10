import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
  updateDocumentStatus,
  type DocumentFilters,
  type UpdateDocumentPayload,
} from "@/api";
import type { DocumentStatus } from "@/types";

export function useDocuments(params: DocumentFilters = {}) {
  return useQuery({ queryKey: ["documents", params], queryFn: () => getDocuments(params) });
}

export function useDocument(id: string) {
  return useQuery({ queryKey: ["document", id], queryFn: () => getDocumentById(id), enabled: !!id });
}

function useInvalidateDocuments() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["documents"] });
    qc.invalidateQueries({ queryKey: ["document"] });
  };
}

export function useCreateDocument() {
  const invalidate = useInvalidateDocuments();
  return useMutation({ mutationFn: createDocument, onSuccess: invalidate });
}

export function useUpdateDocument() {
  const invalidate = useInvalidateDocuments();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & UpdateDocumentPayload) => updateDocument(id, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateDocumentStatus() {
  const invalidate = useInvalidateDocuments();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Exclude<DocumentStatus, "DRAFT"> }) =>
      updateDocumentStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useDeleteDocument() {
  const invalidate = useInvalidateDocuments();
  return useMutation({ mutationFn: deleteDocument, onSuccess: invalidate });
}
