import { useMutation, useQuery } from "@tanstack/react-query";
import {
  forgotPassword,
  getMe,
  resetPassword,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
} from "@/api";

export function useLogin() {
  return useMutation({ mutationFn: userLogin });
}

export function useRegistration() {
  return useMutation({ mutationFn: userRegistration });
}

export function useVerifyAccount() {
  return useMutation({ mutationFn: verifyAccount });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}

export function useLogout() {
  return useMutation({ mutationFn: userLogout });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}
