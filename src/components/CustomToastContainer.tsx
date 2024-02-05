"use client";
import { ToastContainer } from "react-toastify";

export default function CustomToastContainer() {
  const contextClass = {
    success: "bg-accent",
    error: "bg-error",
    info: "bg-info",
    warning: "bg-warning",
    default: "bg-accent",
    dark: "bg-secondary",
  };

  return (
    <ToastContainer
      toastClassName={(context) =>
        contextClass[context?.type || "default"] +
        " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
      }
      bodyClassName={() => "text-sm flex font-white font-med block p-3"}
    />
  );
}
