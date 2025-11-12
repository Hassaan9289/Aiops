'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-10 rounded-none border border-white/10 bg-[var(--card)] px-4 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60",
        className,
      )}
      {...props}
    />
  ),
);
Select.displayName = "Select";
