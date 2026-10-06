import { Suspense } from "react";
import Logo from "@/assets/svg/Logo";
import LoginForm from "@/components/form/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Logo />
            <span>HavenMate</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 flex items-center justify-center p-16 text-center">
          <p className="max-w-sm text-muted-foreground">
            Find verified homes, compatible roommates, and manage rent, utilities and maintenance — all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
