/**
 * ApplicationToast - shared toast notification API.
 *
 * Mount ApplicationToaster once near the application root, then call the
 * typed methods from React event handlers or application services.
 */

import { toast as shadcnToast } from "../../hooks/use-toast";

export type ApplicationToastType = "success" | "error" | "warning" | "info";

export interface ApplicationToastOptions {
  title?: string;
  description?: string;
  type?: ApplicationToastType;
  duration?: number;
}

const DEFAULT_DURATION = 5000;

const VARIANT_MAP: Record<
  ApplicationToastType,
  "default" | "destructive" | "success" | "warning" | "info"
> = {
  success: "success",
  error: "destructive",
  warning: "warning",
  info: "info",
};

function showToast(
  type: ApplicationToastType,
  title: string,
  description?: string,
  duration?: number,
) {
  shadcnToast({
    title,
    description,
    variant: VARIANT_MAP[type],
    duration: duration ?? DEFAULT_DURATION,
  });
}

export const ApplicationToast = {
  success: (title: string, description?: string, duration?: number) =>
    showToast("success", title, description, duration),

  error: (title: string, description?: string, duration?: number) =>
    showToast("error", title, description, duration),

  warning: (title: string, description?: string, duration?: number) =>
    showToast("warning", title, description, duration),

  info: (title: string, description?: string, duration?: number) =>
    showToast("info", title, description, duration),

  show: (options: ApplicationToastOptions) => {
    const { type = "info", title = "", description, duration } = options;
    showToast(type, title, description, duration);
  },
};

export { Toaster as ApplicationToaster } from "../ui/toaster";
