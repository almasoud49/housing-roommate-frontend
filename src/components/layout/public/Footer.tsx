import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} HavenMate — Find your next roommate, safely.</p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-primary">About</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
          <Link href="/pricing" className="hover:text-primary">Pricing</Link>
        </div>
      </div>
    </footer>
  );
}
