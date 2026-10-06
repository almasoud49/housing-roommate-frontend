"use client";

import { ReactNode } from "react";
import QueryProvider from "./query.provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryProvider>
    </ThemeProvider>
  );
}
