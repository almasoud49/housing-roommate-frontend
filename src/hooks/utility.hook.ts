import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBill,
  deleteBill,
  getBillById,
  getBills,
  getMyBills,
  paySplit,
  updateBill,
  updateBillStatus,
  type BillFilters,
  type UpdateBillPayload,
} from "@/api";
import type { UtilityBillStatus } from "@/types";

export function useBills(params: BillFilters = {}) {
  return useQuery({ queryKey: ["bills", params], queryFn: () => getBills(params) });
}

export function useMyBills() {
  return useQuery({ queryKey: ["my-bills"], queryFn: getMyBills });
}

export function useBill(id: string) {
  return useQuery({ queryKey: ["bill", id], queryFn: () => getBillById(id), enabled: !!id });
}

function useInvalidateBills() {
  const qc = useQueryClient();
  return () => {
    for (const key of ["bills", "my-bills", "bill"]) qc.invalidateQueries({ queryKey: [key] });
  };
}

export function useCreateBill() {
  const invalidate = useInvalidateBills();
  return useMutation({ mutationFn: createBill, onSuccess: invalidate });
}

export function useUpdateBill() {
  const invalidate = useInvalidateBills();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & UpdateBillPayload) => updateBill(id, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateBillStatus() {
  const invalidate = useInvalidateBills();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UtilityBillStatus }) => updateBillStatus(id, status),
    onSuccess: invalidate,
  });
}

export function usePaySplit() {
  const invalidate = useInvalidateBills();
  return useMutation({ mutationFn: paySplit, onSuccess: invalidate });
}

export function useDeleteBill() {
  const invalidate = useInvalidateBills();
  return useMutation({ mutationFn: deleteBill, onSuccess: invalidate });
}
