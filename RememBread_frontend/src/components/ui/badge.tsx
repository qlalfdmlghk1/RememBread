import { forwardRef, ComponentPropsWithoutRef, ElementRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-primary-foreground",
        positive: "bg-positive-500 text-positive-foreground",
        negative: "bg-negative-500 text-negative-foreground",
        neutral: "bg-neutral-500 text-neutral-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface BadgeProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<ElementRef<"div">, BadgeProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />;
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
