import { useMutation, useQuery } from "@tanstack/react-query";
import {
  cancelApplication,
  createApplication,
  getLandlordApplications,
  getMyApplications,
  updateApplicationStatus,
} from "@/api";

export function useMyApplications() {
  return useQuery({ queryKey: ["my-applications"], queryFn: getMyApplications });
}

export function useLandlordApplications() {
  return useQuery({ queryKey: ["landlord-applications"], queryFn: getLandlordApplications });
}

export function useCreateApplication() {
  return useMutation({ mutationFn: createApplication });
}

export function useCancelApplication() {
  return useMutation({ mutationFn: cancelApplication });
}

export function useUpdateApplicationStatus() {
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACCEPTED" | "REJECTED" }) =>
      updateApplicationStatus(id, status),
  });
}
