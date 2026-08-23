/**
 * ApplicationToast - 共有 UI ライブラリのトースト通知コンポーネント
 *
 * shadcn/ui の Toast（Base UI の toast manager）をラップし、
 * どこからでも呼べる命令型 API にまとめている。
 * アプリ内の通知はすべて ApplicationToast に一本化する。
 *
 * `ApplicationToaster` をアプリのルート付近に 1 つだけマウントし、
 * React のイベントハンドラやサービス層から下記のメソッドを呼ぶ。
 *
 *   ApplicationToast.success('保存しました')
 *   ApplicationToast.error('保存に失敗しました', 'ネットワークエラーです')
 *
 * アイコンは type に応じて Toaster 側（components/ui/toast.tsx）が自動で描画する。
 * title / description には必ずプレーンな文字列を渡す。
 */

import { toast as toastManager } from "../ui/toast";

/** 通知の種類。shadcn/ui の toast type と 1:1 で対応する。 */
export type ApplicationToastType = "success" | "error" | "warning" | "info";

export interface ApplicationToastOptions {
  title?: string;
  description?: string;
  type?: ApplicationToastType;
  /** 自動で閉じるまでのミリ秒 */
  duration?: number;
}

const DEFAULT_DURATION = 5000;

function showToast(
  type: ApplicationToastType,
  title: string,
  description?: string,
  duration?: number,
) {
  toastManager.add({
    title,
    description,
    type,
    timeout: duration ?? DEFAULT_DURATION,
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

export { Toaster as ApplicationToaster } from "../ui/toast";
