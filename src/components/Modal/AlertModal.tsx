import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx";
import { X } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  acceptButtonText: string;
  cancelButtonText: string;
  acceptButtonClassName?: ClassValue;
  cancelButtonClassName?: ClassValue;
  onClose: () => void;
  onAccept: () => void;
}

export default function AlertModal({
  isOpen,
  title,
  description,
  acceptButtonText,
  cancelButtonText,
  acceptButtonClassName,
  cancelButtonClassName,
  onClose,
  onAccept,
}: AlertModalProps) {
  return (
    <dialog className={cn("modal", isOpen && "modal-open")}>
      <div className="modal-box">
        <button
          className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2 m-2"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-bold">{title}</h3>
        {description && <p className="py-4">{description}</p>}
        <div className="modal-action">
          <div className="flex w-full justify-between">
            <button
              className={cn(
                "btn",
                cancelButtonClassName ? cancelButtonClassName : "btn-error",
              )}
              onClick={onClose}
            >
              {cancelButtonText}
            </button>
            <button
              className={cn("btn btn-primary", acceptButtonClassName)}
              onClick={onAccept}
            >
              {acceptButtonText}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="cursor-default" onClick={onClose} />
      </form>
    </dialog>
  );
}
