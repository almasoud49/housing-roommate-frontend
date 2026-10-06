import { useQuery } from "@tanstack/react-query";
import { getViewings } from "@/api";

export function useViewings() {
  return useQuery({ queryKey: ["viewings"], queryFn: getViewings });
}
