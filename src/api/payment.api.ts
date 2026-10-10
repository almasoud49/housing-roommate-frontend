import apiClient from "@/lib/apiClient";
import type { ApiResponse, Payment } from "@/types";

/**
 * SSLCommerz (test mode): initiate a gateway session for an application.
 * Backend: POST /payment/initiate (auth: TENANT) → 201 { data: Payment }
 * with data.sslCommerzCreateResponse = { GatewayPageURL, sessionkey, tran_id }
 * — the raw sandbox gateway response.
 */
export function initiatePayment(payload: {
  applicationId: string;
  amount: number;
  currency?: string;
}) {
  return apiClient("/payment/initiate", { method: "POST", body: { currency: "BDT", ...payload } });
}

/** Tenant: payment (if any) attached to one of their applications. */
export function getPaymentStatus(applicationId: string) {
  return apiClient<ApiResponse<Payment | null>>(`/payment/application/${applicationId}`);
}

export function getPaymentById(id: string) {
  return apiClient<ApiResponse<Payment>>(`/payment/${id}`);
}

/** Live validation against the SSLCommerz sandbox for a given val_id. */
export function querySslcommerzStatus(valId: string) {
  return apiClient<ApiResponse<unknown>>(`/payment/sslcommerz/status/${valId}`);
}

/** Landlord / admin only. SSLCommerz refunds are keyed by val_id. */
export function refundPayment(payload: {
  paymentId: string;
  amount: number;
  reason: string;
  tranId?: string;
}) {
  return apiClient<ApiResponse<unknown>>("/payment/refund", { method: "POST", body: payload });
}

/**
 * Confirm an SSLCommerz redirect (GET /payment/sslcommerz/callback).
 * SSLCommerz hits the callback itself via the configured success/fail/cancel
 * URLs with ?tran_id=&status=&val_id= (status is VALID | FAILED | CANCELLED);
 * the frontend only calls it as a fallback from the success/cancel pages
 * when the redirect lands on the frontend before the server-to-server
 * validation completes.
 */
export function confirmSslcommerzCallback(params: {
  tran_id: string;
  status: string;
  val_id?: string;
}) {
  const sp = new URLSearchParams(params);
  return apiClient<ApiResponse<unknown>>(`/payment/sslcommerz/callback?${sp.toString()}`);
}
