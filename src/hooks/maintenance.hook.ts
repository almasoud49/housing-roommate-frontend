import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRequest,
  deleteRequest,
  getRequestById,
  getRequests,
  updateRequest,
  updateRequestStatus,
  type MaintenanceFilters,
  type UpdateMaintenancePayload,
} from "@/api";
import type { MaintenanceStatus } from "@/types";

export function useMaintenanceRequests(params: MaintenanceFilters = {}) {
  return useQuery({ queryKey: ["maintenance", params], queryFn: () => getRequests(params) });
}

export function useMaintenanceRequest(id: string) {
  return useQuery({ queryKey: ["maintenance-item", id], queryFn: () => getRequestById(id), enabled: !!id });
}

function useInvalidateMaintenance() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["maintenance"] });
    qc.invalidateQueries({ queryKey: ["maintenance-item"] });
  };
}

export function useCreateMaintenance() {
  const invalidate = useInvalidateMaintenance();
  return useMutation({ mutationFn: createRequest, onSuccess: invalidate });
}

export function useUpdateMaintenance() {
  const invalidate = useInvalidateMaintenance();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & UpdateMaintenancePayload) => updateRequest(id, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateMaintenanceStatus() {
  const invalidate = useInvalidateMaintenance();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MaintenanceStatus }) => updateRequestStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useDeleteMaintenance() {
  const invalidate = useInvalidateMaintenance();
  return useMutation({ mutationFn: deleteRequest, onSuccess: invalidate });
}
