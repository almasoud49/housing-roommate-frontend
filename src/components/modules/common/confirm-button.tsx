"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/** Button that asks for confirmation before running a destructive action. */
export function ConfirmButton({
  children,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  onConfirm,
  pending,
  ...buttonProps
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  pending?: boolean;
} & Omit<ComponentProps<typeof Button>, "onClick" | "children">) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button {...buttonProps} />}>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
