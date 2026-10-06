import apiClient from "@/lib/apiClient";

export function initiatePayment(payload: {
  applicationId: string;
  amount: number;
  currency: string;
}) {
  return apiClient("/payment/initiate", { method: "POST", body: payload });
}
