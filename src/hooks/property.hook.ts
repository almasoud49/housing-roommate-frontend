import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createProperty,
  getMyProperties,
  getProperties,
  getPropertyById,
} from "@/api";

export function useProperties(params: Record<string, string>) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => getProperties(params),
  });
}

export function useProperty(id: string) {
  return useQuery({ queryKey: ["property", id], queryFn: () => getPropertyById(id) });
}

export function useMyProperties() {
  return useQuery({ queryKey: ["my-properties"], queryFn: getMyProperties });
}

export function useCreateProperty() {
  return useMutation({ mutationFn: createProperty });
}
