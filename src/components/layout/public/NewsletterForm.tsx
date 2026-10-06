"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("Subscribed to the newsletter!");
    setEmail("");
  };

  return (
    <form onSubmit={subscribe} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="h-9 flex-1 rounded-md border bg-background px-3 text-sm"
      />
      <button type="submit" className="rounded-md bg-primary px-4 text-sm text-primary-foreground">
        Join
      </button>
    </form>
  );
}
