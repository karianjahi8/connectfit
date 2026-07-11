import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold tracking-tight ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-accent-glow active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-accent/40 bg-transparent text-foreground hover:border-accent hover:text-accent hover:bg-accent/10",
        secondary:
          "bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent-glow",
        ghost: "text-foreground/80 hover:bg-accent/10 hover:text-foreground",
        link: "text-accent underline-offset-4 hover:underline",
        hero: "bg-primary text-primary-foreground shadow-glow hover:shadow-accent-glow hover:scale-[1.02] active:scale-[0.98]",
        accent:
          "bg-accent text-accent-foreground shadow-accent-glow hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        glass:
          "glass border border-accent/30 text-foreground hover:border-accent/60 hover:text-accent backdrop-blur-md",
        wallet:
          "bg-secondary text-secondary-foreground border border-accent/30 hover:border-accent/60 hover:bg-secondary/80",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
