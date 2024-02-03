import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx";
import { ButtonHTMLAttributes } from "react";

type LoadingButtonProps = {
  loading: boolean;
  className?: ClassValue;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function LoadingButton({
  loading,
  children,
  className,
  ...buttonProps
}: LoadingButtonProps) {
  return (
    <button
      disabled={loading}
      className={cn("btn btn-primary", className)}
      {...buttonProps}
    >
      {loading && <span className="loading loading-spinner"></span>}
      {children}
    </button>
  );
}
