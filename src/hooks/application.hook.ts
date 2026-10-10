import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelApplication,
  createApplication,
  getLandlordApplications,
  getMyApplications,
  updateApplicationStatus,
  type ApplicationFilters,
} from "@/api";
import type { ApplicationStatus } from "@/types";

export function useMyApplications(params: ApplicationFilters = {}, enabled = true) {
  return useQuery({ queryKey: ["my-applications", params], queryFn: () => getMyApplications(params), enabled });
}

export function useLandlordApplications(params: ApplicationFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ["landlord-applications", params],
    queryFn: () => getLandlordApplications(params),
    enabled,
  });
}

function useInvalidateApplications() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["my-applications"] });
    qc.invalidateQueries({ queryKey: ["landlord-applications"] });
  };
}

export function useCreateApplication() {
  const invalidate = useInvalidateApplications();
  return useMutation({ mutationFn: createApplication, onSuccess: invalidate });
}

export function useCancelApplication() {
  const invalidate = useInvalidateApplications();
  return useMutation({ mutationFn: cancelApplication, onSuccess: invalidate });
}

export function useUpdateApplicationStatus() {
  const invalidate = useInvalidateApplications();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) => updateApplicationStatus(id, status),
    onSuccess: invalidate,
  });
}
