import { Toast } from "@base-ui/react/toast";
import type * as React from "react";

export const toastManager = Toast.createToastManager();

export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";

interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

function toast({ variant = "default", duration, ...props }: ToastOptions) {
  const id = toastManager.add({
    ...props,
    type: variant,
    timeout: duration,
  });

  return {
    id,
    dismiss: () => toastManager.close(id),
    update: ({ variant: nextVariant, duration: nextDuration, ...next }: ToastOptions) =>
      toastManager.update(id, {
        ...next,
        type: nextVariant,
        timeout: nextDuration,
      }),
  };
}

export { toast };
