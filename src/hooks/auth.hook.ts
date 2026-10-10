import { useMutation, useQuery } from "@tanstack/react-query";
import {
  forgotPassword,
  getMe,
  googleLogin,
  refreshToken,
  resetPassword,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
} from "@/api";
import type { User } from "@/types";

export function useLogin() {
  return useMutation({ mutationFn: userLogin });
}

export function useGoogleLogin() {
  return useMutation({ mutationFn: googleLogin });
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

export function useRefreshToken() {
  return useMutation({ mutationFn: refreshToken });
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

/** The signed-in user (from GET /auth/me) or undefined while loading / signed out. */
export function useCurrentUser() {
  const { data, isLoading } = useGetMe();
  return { user: data?.data as User | undefined, isLoading };
}
