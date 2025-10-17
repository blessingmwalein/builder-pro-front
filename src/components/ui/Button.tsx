import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "gradient" | "outline";
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  isLoading?: boolean;
}

export function buttonVariants({
  variant = "primary",
  className = "",
}: { variant?: string; className?: string } = {}) {
  let base =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 px-6 py-2 text-base";
  let color =
    variant === "primary"
      ? "bg-orange-500 hover:bg-orange-600 text-white"
      : variant === "secondary"
      ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
      : variant === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : variant === "gradient"
      ? "bg-gradient-to-tr from-orange-500 via-orange-400 to-yellow-400 text-white hover:brightness-110"
      : variant === "outline"
      ? "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
      : "";

  return cn(base, color, className);
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      type = "button",
      prefixIcon,
      suffixIcon,
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonVariants({ variant, className })}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {prefixIcon && <span className="mr-2 flex items-center">{prefixIcon}</span>}
        <span className="flex items-center">{children}</span>
        {suffixIcon && <span className="ml-2 flex items-center">{suffixIcon}</span>}
        {isLoading && (
          <svg className="animate-spin ml-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
