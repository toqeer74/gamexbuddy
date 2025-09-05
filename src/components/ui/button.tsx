import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-destructive/25 hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-primary/20 bg-background hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors shadow-sm hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        ghost: "hover:bg-primary/10 hover:text-primary hover:scale-[1.01] active:scale-[0.99]",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        neon: "bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] text-white border border-primary/20 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.05] active:scale-[0.95] transform-gpu",
        neonGlow: "bg-gradient-to-r from-[#ff2bd6] via-[#8b5cf6] to-[#00f5ff] text-white border border-primary/30 shadow-2xl shadow-primary/50 hover:shadow-primary/70 hover:scale-[1.08] active:scale-[0.92] animate-pulse-glow",
        cyber: "bg-black border border-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/25 hover:shadow-xl hover:shadow-[#8b5cf6]/50 hover:border-[#ff2bd6] hover:scale-[1.03] active:scale-[0.97]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
        xl: "h-12 rounded-lg px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
