import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyVerificationStatus,
  getPendingVerifications,
  reviewVerification,
  uploadVerificationDocs,
  type VerificationFilters,
} from "@/api";

export function useMyVerificationStatus() {
  return useQuery({ queryKey: ["verification-status"], queryFn: getMyVerificationStatus });
}

export function useUploadVerificationDocs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadVerificationDocs,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["verification-status"] }),
  });
}

export function usePendingVerifications(params: VerificationFilters = {}) {
  return useQuery({ queryKey: ["verifications", params], queryFn: () => getPendingVerifications(params) });
}

export function useReviewVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reviewVerification,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["verifications"] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}
