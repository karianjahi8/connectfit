import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "gradient";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-white/5 border-white/10",
      elevated: "bg-white/[0.08] border-white/[0.15] shadow-strong",
      gradient: "bg-gradient-to-br from-primary/10 to-accent/10 border-white/20",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "backdrop-blur-xl border rounded-xl p-6 transition-all duration-300",
          "hover:bg-white/[0.08] hover:border-white/20 hover:shadow-glow hover:-translate-y-1",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
