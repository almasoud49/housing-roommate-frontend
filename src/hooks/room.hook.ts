import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoom,
  deleteRoom,
  getMyRooms,
  getRoomById,
  getRooms,
  updateRoom,
  type RoomFilters,
  type RoomPayload,
} from "@/api";

export function useRooms(params: RoomFilters = {}) {
  return useQuery({ queryKey: ["rooms", params], queryFn: () => getRooms(params) });
}

/** Landlord's own rooms (LANDLORD role only on the backend). */
export function useMyRooms(params: RoomFilters = {}, enabled = true) {
  return useQuery({ queryKey: ["my-rooms", params], queryFn: () => getMyRooms(params), enabled });
}

export function useRoom(id: string) {
  return useQuery({ queryKey: ["room", id], queryFn: () => getRoomById(id), enabled: !!id });
}

function useInvalidateRooms() {
  const qc = useQueryClient();
  return () => {
    for (const key of ["rooms", "my-rooms", "room", "flats", "flat", "buildings", "building", "property", "properties"]) {
      qc.invalidateQueries({ queryKey: [key] });
    }
  };
}

export function useCreateRoom() {
  const invalidate = useInvalidateRooms();
  return useMutation({ mutationFn: createRoom, onSuccess: invalidate });
}

export function useUpdateRoom() {
  const invalidate = useInvalidateRooms();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Omit<RoomPayload, "flatId">>) =>
      updateRoom(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteRoom() {
  const invalidate = useInvalidateRooms();
  return useMutation({ mutationFn: deleteRoom, onSuccess: invalidate });
}
