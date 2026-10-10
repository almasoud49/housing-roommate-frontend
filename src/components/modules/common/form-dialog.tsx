"use client";

import { useState, type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "./form-field";

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "checkbox";
  required?: boolean;
  min?: number;
  hint?: string;
}

export type FormValues = Record<string, string | boolean>;

/**
 * Small config-driven create/edit dialog. `onSubmit` receives raw string values
 * (checkboxes are booleans) and must call `done()` on success to close the dialog.
 */
export function FormDialog({
  triggerLabel,
  triggerProps,
  title,
  fields,
  initial = {},
  submitLabel = "Save",
  pending,
  onSubmit,
}: {
  triggerLabel: string;
  triggerProps?: Omit<ComponentProps<typeof Button>, "onClick" | "children">;
  title: string;
  fields: FieldDef[];
  initial?: FormValues;
  submitLabel?: string;
  pending?: boolean;
  onSubmit: (values: FormValues, done: () => void) => void;
}) {
  const [open, setOpen] = useState(false);
  const blank = (): FormValues =>
    Object.fromEntries(fields.map((f) => [f.name, initial[f.name] ?? (f.type === "checkbox" ? false : "")]));
  const [values, setValues] = useState<FormValues>(blank);

  const missing = fields.some((f) => f.required && !String(values[f.name] ?? "").trim());

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) setValues(blank());
        setOpen(o);
      }}
    >
      <DialogTrigger render={<Button {...triggerProps} />}>{triggerLabel}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(values, () => setOpen(false));
          }}
        >
          {fields.map((f) =>
            f.type === "checkbox" ? (
              <label key={f.name} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.checked })} />
                {f.label}
              </label>
            ) : (
              <FormField key={f.name} label={f.label} hint={f.hint}>
                {f.type === "textarea" ? (
                  <Textarea value={String(values[f.name] ?? "")} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
                ) : (
                  <Input
                    type={f.type ?? "text"}
                    min={f.min}
                    value={String(values[f.name] ?? "")}
                    onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                  />
                )}
              </FormField>
            ),
          )}
          <Button type="submit" disabled={pending || missing}>
            {pending ? "Saving..." : submitLabel}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
