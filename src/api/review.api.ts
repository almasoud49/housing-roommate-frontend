import apiClient from "@/lib/apiClient";
import type { ApiResponse, ListResponse, Review } from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface ReviewFilters extends ListParams {
  revieweeId?: string;
  sortBy?: "createdAt" | "rating";
}

export function createReview(payload: { revieweeId: string; rating: number; comment?: string }) {
  return apiClient<ApiResponse<Review>>("/reviews", { method: "POST", body: payload });
}

export function getReviews(params: ReviewFilters = {}) {
  return apiClient<ListResponse<Review>>(`/reviews${buildQuery(params)}`);
}

export function getReviewById(id: string) {
  return apiClient<ApiResponse<Review>>(`/reviews/${id}`);
}
