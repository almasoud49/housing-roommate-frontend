import { Spinner } from "@/components/ui/spinner";

export default function AuthLoading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner />
      <p>{label}</p>
    </div>
  );
}
