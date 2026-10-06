"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  if (email) return <ResetStep email={email} onDone={() => router.push("/login")} />;

  return <EmailStep onSent={setEmail} />;
}

function EmailStep({ onSent }: { onSent: (email: string) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>({
    resolver: zodResolver(z.object({ email: z.string().email("Invalid email") })),
  });
  const onSubmit = async ({ email }: { email: string }) => {
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("If the email exists, an OTP has been sent.");
      onSent(email);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-center text-2xl font-bold">Forgot Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>Send Reset OTP</Button>
      </form>
    </div>
  );
}

function ResetStep({ email, onDone }: { email: string; onDone: () => void }) {
  const schema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
  });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const onSubmit = async (d: z.infer<typeof schema>) => {
    try {
      await api.post("/auth/reset-password", { email, ...d });
      toast.success("Password reset! Please log in.");
      onDone();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-center text-2xl font-bold">Reset Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="OTP" {...register("otp")} />
        {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
        <Input placeholder="New password" type="password" {...register("newPassword")} />
        {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>Reset Password</Button>
      </form>
    </div>
  );
}
