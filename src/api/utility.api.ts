import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ListResponse,
  UtilityBill,
  UtilityBillSplit,
  UtilityBillStatus,
  UtilityType,
} from "@/types";
import { buildQuery, type ListParams } from "@/utils/query.util";

export interface BillFilters extends ListParams {
  type?: UtilityType;
  status?: UtilityBillStatus;
  roomId?: string;
  tenantId?: string;
  sortBy?: "createdAt" | "dueDate" | "amount";
}

export interface CreateBillPayload {
  roomId: string;
  type: UtilityType;
  amount: number;
  currency?: string;
  /** ISO datetime */
  billingPeriod: string;
  /** ISO datetime */
  dueDate: string;
  billUrl?: string;
  notes?: string;
  /** Split amounts must add up to `amount`. */
  splits: { tenantId: string; amount: number }[];
}

export type UpdateBillPayload = Partial<Omit<CreateBillPayload, "roomId" | "splits">>;

export function createBill(payload: CreateBillPayload) {
  return apiClient<ApiResponse<UtilityBill>>("/utilities/bills", { method: "POST", body: payload });
}

export function getBills(params: BillFilters = {}) {
  return apiClient<ListResponse<UtilityBill>>(`/utilities/bills${buildQuery(params)}`);
}

/** Tenant: the splits assigned to the current user. */
export function getMyBills() {
  return apiClient<ApiResponse<UtilityBillSplit[]>>("/utilities/my-bills");
}

export function getBillById(id: string) {
  return apiClient<ApiResponse<UtilityBill>>(`/utilities/bills/${id}`);
}

export function updateBill(id: string, payload: UpdateBillPayload) {
  return apiClient<ApiResponse<UtilityBill>>(`/utilities/bills/${id}`, { method: "PATCH", body: payload });
}

export function updateBillStatus(id: string, status: UtilityBillStatus) {
  return apiClient<ApiResponse<UtilityBill>>(`/utilities/bills/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function paySplit(splitId: string) {
  return apiClient<ApiResponse<UtilityBillSplit>>(`/utilities/splits/${splitId}/pay`, { method: "PATCH" });
}

export function deleteBill(id: string) {
  return apiClient<ApiResponse<null>>(`/utilities/bills/${id}`, { method: "DELETE" });
}
