/**
 * ApplicationToast - 共有 UI ライブラリのトースト通知コンポーネント
 *
 * shadcn/ui の Toast をラップし、簡潔な API でトースト通知を表示する。
 * アプリ内の通知はすべて ApplicationToast に一本化する。
 *
 * `ApplicationToaster` をアプリのルート付近に 1 つだけマウントし、
 * React のイベントハンドラやサービス層から下記のメソッドを呼ぶ。
 *
 *   ApplicationToast.success('保存しました')
 *   ApplicationToast.error('保存に失敗しました', 'ネットワークエラーです')
 *
 * アイコンは variant に応じて Toaster 側（components/ui/toaster.tsx）が
 * 自動で描画する。title / description には必ずプレーンな文字列を渡す。
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
