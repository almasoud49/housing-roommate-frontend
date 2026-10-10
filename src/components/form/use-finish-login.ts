"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { decodeJwt, setAccessToken, setRoleCookie } from "@/utils";
import { getErrorMessage } from "@/lib/apiClient";
import { useGoogleLogin } from "@/hooks";

/** Stores the token, sets the role cookie and redirects to the role's home (or `?next=`). */
export function useFinishLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  return (res: { data?: { accessToken?: string } }) => {
    const token = res?.data?.accessToken;
    const user = token ? decodeJwt(token) : null;
    if (!token || !user) {
      toast.error("Invalid login response");
      return;
    }
    setAccessToken(token);
    setRoleCookie(user.role);
    queryClient.removeQueries({ queryKey: ["user"] });
    toast.success(`Welcome back, ${user.name}!`);
    const next = searchParams.get("next");
    const home = user.role === "ADMIN" ? "/admin" : user.role === "LANDLORD" || user.role === "PROPERTY_MANAGER" ? "/landlord" : "/dashboard";
    router.push(next ?? home);
    router.refresh();
  };
}

/** Returns a callback that exchanges a Google ID token for a session. */
export function useGoogleSession() {
  const { mutate } = useGoogleLogin();
  const finishLogin = useFinishLogin();
  return (idToken: string) =>
    mutate({ idToken }, { onSuccess: finishLogin, onError: (err) => toast.error(getErrorMessage(err)) });
}
