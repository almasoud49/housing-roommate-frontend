import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBuilding,
  deleteBuilding,
  getBuildingById,
  getBuildings,
  getBuildingsByProperty,
  updateBuilding,
  type BuildingFilters,
  type BuildingPayload,
} from "@/api";

export function useBuildings(params: BuildingFilters = {}) {
  return useQuery({ queryKey: ["buildings", params], queryFn: () => getBuildings(params) });
}

export function useBuildingsByProperty(propertyId: string, params: BuildingFilters = {}) {
  return useQuery({
    queryKey: ["buildings", "property", propertyId, params],
    queryFn: () => getBuildingsByProperty(propertyId, params),
    enabled: !!propertyId,
  });
}

export function useBuilding(id: string) {
  return useQuery({ queryKey: ["building", id], queryFn: () => getBuildingById(id), enabled: !!id });
}

function useInvalidateBuildings() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["buildings"] });
    qc.invalidateQueries({ queryKey: ["building"] });
    qc.invalidateQueries({ queryKey: ["property"] });
    qc.invalidateQueries({ queryKey: ["my-properties"] });
  };
}

export function useCreateBuilding() {
  const invalidate = useInvalidateBuildings();
  return useMutation({ mutationFn: createBuilding, onSuccess: invalidate });
}

export function useUpdateBuilding() {
  const invalidate = useInvalidateBuildings();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Omit<BuildingPayload, "propertyId">>) =>
      updateBuilding(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteBuilding() {
  const invalidate = useInvalidateBuildings();
  return useMutation({ mutationFn: deleteBuilding, onSuccess: invalidate });
}
