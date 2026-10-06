"use client";

import { useGetMe } from "@/hooks";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();

  useEffect(() => {
    if (isPending) return;
    if (isError || !data?.data) router.replace("/login");
  }, [isPending, isError, data, router]);

  if (isPending) return <AuthLoading />;
  if (isError || !data?.data) return <AuthLoading label="Redirecting..." />;
  return <>{children}</>;
}
