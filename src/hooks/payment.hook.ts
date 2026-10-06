import { useMutation } from "@tanstack/react-query";
import { initiatePayment } from "@/api";

export function useInitiatePayment() {
  return useMutation({ mutationFn: initiatePayment });
}
