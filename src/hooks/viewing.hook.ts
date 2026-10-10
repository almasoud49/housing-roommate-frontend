import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createViewing,
  deleteViewing,
  getViewingById,
  getViewings,
  updateViewingStatus,
  type ViewingFilters,
} from "@/api";
import type { ViewingStatus } from "@/types";

export function useViewings(params: ViewingFilters = {}) {
  return useQuery({ queryKey: ["viewings", params], queryFn: () => getViewings(params) });
}

export function useViewing(id: string) {
  return useQuery({ queryKey: ["viewing", id], queryFn: () => getViewingById(id), enabled: !!id });
}

function useInvalidateViewings() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["viewings"] });
    qc.invalidateQueries({ queryKey: ["viewing"] });
  };
}

export function useCreateViewing() {
  const invalidate = useInvalidateViewings();
  return useMutation({ mutationFn: createViewing, onSuccess: invalidate });
}

export function useUpdateViewingStatus() {
  const invalidate = useInvalidateViewings();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Exclude<ViewingStatus, "PENDING"> }) =>
      updateViewingStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useDeleteViewing() {
  const invalidate = useInvalidateViewings();
  return useMutation({ mutationFn: deleteViewing, onSuccess: invalidate });
}
