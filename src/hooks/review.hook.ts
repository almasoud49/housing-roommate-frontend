import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReview, getReviewById, getReviews, type ReviewFilters } from "@/api";

export function useReviews(params: ReviewFilters = {}) {
  return useQuery({ queryKey: ["reviews", params], queryFn: () => getReviews(params) });
}

export function useReview(id: string) {
  return useQuery({ queryKey: ["review", id], queryFn: () => getReviewById(id), enabled: !!id });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
