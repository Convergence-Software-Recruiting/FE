import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "hero" | "heroOutline" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "xl";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg":
              variant === "default",
            "bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 hover:from-gold-400 hover:to-gold-500 shadow-lg hover:shadow-xl hover:scale-105 font-bold":
              variant === "hero",
            "border-2 border-gold-500 text-gold-500 bg-transparent hover:bg-gold-500 hover:text-navy-900 font-bold":
              variant === "heroOutline",
            "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground":
              variant === "outline",
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          },
          {
            "h-9 px-4 text-sm": size === "default",
            "h-8 px-3 text-xs": size === "sm",
            "h-11 px-6 text-base": size === "lg",
            "h-14 px-8 text-lg": size === "xl",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

