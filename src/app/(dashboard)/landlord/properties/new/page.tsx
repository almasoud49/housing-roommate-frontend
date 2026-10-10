"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateProperty } from "@/hooks";
import { getErrorMessage } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const steps = ["Basics", "Location", "Review"] as const;

export default function NewPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ title: "", description: "", address: "", city: "" });

  const errors: string[] = [];
  if (step === 0) {
    if (form.title.trim().length < 3) errors.push("Title must be at least 3 characters");
    if (form.description.trim().length < 10) errors.push("Description must be at least 10 characters");
  }
  if (step === 1) {
    if (form.address.trim().length < 5) errors.push("Address must be at least 5 characters");
    if (form.city.trim().length < 2) errors.push("City must be at least 2 characters");
  }

  const next = () => {
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const { mutate: create, isPending: loading } = useCreateProperty();

  const submit = () => {
    create(form, {
      onSuccess: (res) => {
        toast.success("Property created! Now add buildings, flats and rooms.");
        router.push(res?.data?.id ? `/landlord/properties/${res.data.id}` : "/landlord/properties");
      },
      onError: (e) => toast.error(getErrorMessage(e)),
    });
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">Add New Property</h1>
      <div className="mb-6 flex items-center gap-2 text-sm">
        {steps.map((s, i) => (
          <span key={s} className={`rounded-full px-3 py-1 ${i === step ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{i + 1}. {s}</span>
        ))}
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          {step === 0 && (
            <>
              <Input placeholder="Property title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </>
          )}
          {step === 1 && (
            <>
              <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </>
          )}
          {step === 2 && (
            <ul className="space-y-2 text-sm">
              <li><b>Title:</b> {form.title}</li>
              <li><b>Description:</b> {form.description}</li>
              <li><b>Address:</b> {form.address}, {form.city}</li>
            </ul>
          )}
          <div className="flex justify-between">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
            {step < steps.length - 1 ? (
              <Button onClick={next}>Next</Button>
            ) : (
              <Button onClick={submit} disabled={loading}>{loading ? "Creating..." : "Create Property"}</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
