"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["TENANT", "LANDLORD", "PROPERTY_MANAGER"]),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [otpSent, setOtpSent] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "TENANT" },
  });

  const onSubmit = async (d: FormData) => {
    try {
      await api.post("/auth/register", d);
      toast.success("Registration successful! Check your email for the OTP.");
      setOtpSent(d.email);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (otpSent) {
    return <VerifyEmail email={otpSent} />;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-center text-3xl font-bold">Create Account</h1>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div><Input placeholder="Full name" {...register("name")} />{errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}</div>
            <div><Input placeholder="Email" type="email" {...register("email")} />{errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}</div>
            <div><Input placeholder="Password" type="password" {...register("password")} />{errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}</div>
            <div>
              <select className="h-9 w-full rounded-md border px-3 text-sm" {...register("role")}>
                <option value="TENANT">Tenant</option>
                <option value="LANDLORD">Landlord</option>
                <option value="PROPERTY_MANAGER">Property Manager</option>
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Register"}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function VerifyEmail({ email }: { email: string }) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ otp: string }>({
    resolver: zodResolver(z.object({ otp: z.string().length(6, "OTP must be 6 digits") })),
  });
  const onVerify = async ({ otp }: { otp: string }) => {
    try {
      await api.post("/auth/verify-email", { email, otp });
      toast.success("Email verified! You can now log in.");
      router.push("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-center text-2xl font-bold">Verify your email</h1>
      <p className="mb-6 text-center text-muted-foreground">We sent an OTP to {email}</p>
      <form onSubmit={handleSubmit(onVerify)} className="space-y-4">
        <Input placeholder="Enter OTP" {...register("otp")} />
        {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>Verify Email</Button>
      </form>
    </div>
  );
}
