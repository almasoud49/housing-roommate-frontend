import { Skeleton } from "@/components/ui/skeleton";

export function ListPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-10">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    </div>
  );
}

export default function Loading() {
  return <ListPageSkeleton />;
}
