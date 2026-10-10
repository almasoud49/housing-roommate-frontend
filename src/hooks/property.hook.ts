import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProperty,
  deleteProperty,
  getMyProperties,
  getProperties,
  getPropertyById,
  updateProperty,
  type PropertyFilters,
  type PropertyPayload,
} from "@/api";

export function useProperties(params: PropertyFilters = {}) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => getProperties(params),
  });
}

export function useProperty(id: string) {
  return useQuery({ queryKey: ["property", id], queryFn: () => getPropertyById(id), enabled: !!id });
}

export function useMyProperties(params: PropertyFilters = {}) {
  return useQuery({ queryKey: ["my-properties", params], queryFn: () => getMyProperties(params) });
}

function useInvalidateProperties() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["my-properties"] });
    qc.invalidateQueries({ queryKey: ["properties"] });
    qc.invalidateQueries({ queryKey: ["property"] });
  };
}

export function useCreateProperty() {
  const invalidate = useInvalidateProperties();
  return useMutation({ mutationFn: createProperty, onSuccess: invalidate });
}

export function useUpdateProperty() {
  const invalidate = useInvalidateProperties();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<PropertyPayload>) => updateProperty(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteProperty() {
  const invalidate = useInvalidateProperties();
  return useMutation({ mutationFn: deleteProperty, onSuccess: invalidate });
}
