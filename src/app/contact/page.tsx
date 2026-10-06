"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = () => {
    toast.success("Thanks! We'll get back to you within 24 hours.");
    reset();
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">Contact Us</h1>
      <p className="mb-8 text-muted-foreground">Questions, partnerships, or support — we&apos;re here.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Your name" {...register("name")} />
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <Input placeholder="Email" {...register("email")} />
          {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div>
          <Textarea placeholder="How can we help?" rows={6} {...register("message")} />
          {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>}
        </div>
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  );
}
