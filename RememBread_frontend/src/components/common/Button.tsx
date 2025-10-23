import { forwardRef, MouseEventHandler, ReactNode } from "react";
import clsx from "clsx";
import { ButtonUI } from "@/components/ui/button";

interface ButtonProps {
  type?: "submit" | "button";
  variant?:
    | "primary"
    | "primary-outline"
    | "positive"
    | "positive-outline"
    | "negative"
    | "negative-outline"
    | "neutral"
    | "neutral-outline"
    | "shadow";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type = "button", variant, className, onClick, children, disabled }, ref) => {
    return (
      <ButtonUI
        ref={ref}
        type={type}
        className={clsx(
          "text-sm font-bold rounded-lg transition-colors ease-in-out",
          {
            "bg-primary-500 hover:bg-primary-400 text-white": variant === "primary",
            "bg-white hover:bg-neutral-100 border-2 border-primary-500 text-primary-500":
              variant === "primary-outline",
            "bg-positive-400 hover:bg-positive-300 text-white": variant === "positive",
            "bg-white hover:bg-neutral-100 border-2 border-positive-400 text-neutral-700":
              variant === "positive-outline",
            "bg-negative-400 hover:bg-negative-300 text-white": variant === "negative",
            "bg-white hover:bg-neutral-100 border-2 border-negative-400 text-neutral-700":
              variant === "negative-outline",
            "bg-neutral-500 hover:bg-neutral-400 text-white": variant === "neutral",
            "bg-white hover:bg-neutral-100 border-2 border-neutral-400 text-neutral-700":
              variant === "neutral-outline",
            "bg-white hover:bg-neutral-100 border border-neutral-200 shadow-md text-neutral-700":
              variant === "shadow",
          },
          className,
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </ButtonUI>
    );
  },
);

Button.displayName = "Button";

export default Button;
