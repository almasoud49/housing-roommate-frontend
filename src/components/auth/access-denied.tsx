import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="text-muted-foreground">You don&apos;t have permission to view this page.</p>
      <Link href="/" className="text-primary">Go home →</Link>
    </div>
  );
}
