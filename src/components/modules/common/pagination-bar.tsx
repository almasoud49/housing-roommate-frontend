import { Button } from "@/components/ui/button";
import type { Meta } from "@/types";

export function PaginationBar({
  meta,
  onPageChange,
}: {
  meta?: Meta;
  onPageChange: (page: number) => void;
}) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        Page {meta.page} of {meta.totalPages} · {meta.total} total
      </span>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)}>
          Previous
        </Button>
        <Button size="sm" variant="outline" disabled={meta.page >= meta.totalPages} onClick={() => onPageChange(meta.page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
