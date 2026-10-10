import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPaymentById,
  getPaymentStatus,
  initiatePayment,
  querySslcommerzStatus,
  refundPayment,
} from "@/api";

export function useInitiatePayment() {
  return useMutation({ mutationFn: initiatePayment });
}

export function usePaymentStatus(applicationId: string, enabled = true) {
  return useQuery({
    queryKey: ["payment-status", applicationId],
    queryFn: () => getPaymentStatus(applicationId),
    enabled: enabled && !!applicationId,
    retry: false,
  });
}

export function usePayment(id: string) {
  return useQuery({ queryKey: ["payment", id], queryFn: () => getPaymentById(id), enabled: !!id });
}

export function useSslcommerzStatus(valId: string, enabled = true) {
  return useQuery({
    queryKey: ["sslcommerz-status", valId],
    queryFn: () => querySslcommerzStatus(valId),
    enabled: enabled && !!valId,
    retry: false,
  });
}

export function useRefundPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: refundPayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payment"] });
      qc.invalidateQueries({ queryKey: ["payment-status"] });
      qc.invalidateQueries({ queryKey: ["landlord-applications"] });
      qc.invalidateQueries({ queryKey: ["sslcommerz-status"] });
    },
  });
}
