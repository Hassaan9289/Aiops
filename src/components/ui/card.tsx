import * as React from "react";
import { cn } from "@/lib/utils";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-none border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_20px_45px_rgba(3,7,18,0.15)]",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";
