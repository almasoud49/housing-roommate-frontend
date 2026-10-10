import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFlat,
  deleteFlat,
  getFlatById,
  getFlats,
  getFlatsByBuilding,
  updateFlat,
  type FlatFilters,
  type FlatPayload,
} from "@/api";

export function useFlats(params: FlatFilters = {}) {
  return useQuery({ queryKey: ["flats", params], queryFn: () => getFlats(params) });
}

export function useFlatsByBuilding(buildingId: string, params: FlatFilters = {}) {
  return useQuery({
    queryKey: ["flats", "building", buildingId, params],
    queryFn: () => getFlatsByBuilding(buildingId, params),
    enabled: !!buildingId,
  });
}

export function useFlat(id: string) {
  return useQuery({ queryKey: ["flat", id], queryFn: () => getFlatById(id), enabled: !!id });
}

function useInvalidateFlats() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["flats"] });
    qc.invalidateQueries({ queryKey: ["flat"] });
    qc.invalidateQueries({ queryKey: ["buildings"] });
    qc.invalidateQueries({ queryKey: ["building"] });
    qc.invalidateQueries({ queryKey: ["property"] });
  };
}

export function useCreateFlat() {
  const invalidate = useInvalidateFlats();
  return useMutation({ mutationFn: createFlat, onSuccess: invalidate });
}

export function useUpdateFlat() {
  const invalidate = useInvalidateFlats();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Omit<FlatPayload, "buildingId">>) =>
      updateFlat(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteFlat() {
  const invalidate = useInvalidateFlats();
  return useMutation({ mutationFn: deleteFlat, onSuccess: invalidate });
}
