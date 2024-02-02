import { ButtonHTMLAttributes } from "react";

type LoadingButtonProps = {
  loading: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function LoadingButton({
  loading,
  children,
  ...buttonProps
}: LoadingButtonProps) {
  return (
    <button
      disabled={loading}
      className="btn btn-primary btn-block "
      {...buttonProps}
    >
      {loading && <span className="loading loading-spinner"></span>}
      {children}
    </button>
  );
}
