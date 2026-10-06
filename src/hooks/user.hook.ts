import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "@/api";

export function useUserProfile() {
  return useQuery({ queryKey: ["me-profile"], queryFn: getUserProfile });
}

export function useUpdateUserProfile() {
  return useMutation({ mutationFn: updateUserProfile });
}
