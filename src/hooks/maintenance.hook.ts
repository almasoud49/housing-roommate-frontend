import { useMutation, useQuery } from "@tanstack/react-query";
import { createRequest, getRequests } from "@/api";

export function useMaintenanceRequests() {
  return useQuery({ queryKey: ["maintenance"], queryFn: getRequests });
}

export function useCreateMaintenance() {
  return useMutation({ mutationFn: createRequest });
}
