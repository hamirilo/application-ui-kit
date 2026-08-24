/**
 * Django 連携 Island が共有するグローバル型定義
 *
 * htmx はこのパッケージの依存に含めません。Django テンプレート側で読み込まれた
 * `window.htmx` を利用するだけなので、ここで最小限の型だけを宣言します。
 */

export interface HtmxApi {
  trigger: (element: HTMLElement, eventName: string) => void;
  process: (element: HTMLElement) => void;
  ajax: (
    verb: string,
    path: string,
    context: { target: HTMLElement; swap?: string },
  ) => Promise<void>;
}

declare global {
  interface Window {
    htmx?: HtmxApi;
    /** ToastListenerIsland が登録する。素の JS / htmx から window.ApplicationToast.success(...) で呼ぶ */
    ApplicationToast?: typeof import("../application/ApplicationToast").ApplicationToast;
    /** ConfirmDialogIsland が id ごとに登録する開閉トリガー */
    openConfirmDialog?: Record<string, () => void>;
    /** FormDialogIsland が id ごとに登録する開閉トリガー */
    openFormDialog?: Record<string, () => void>;
    /** auto-mount が登録する手動マウント API */
    ReactIslands?: {
      mount: (element: HTMLElement, componentName: string) => void;
      initialize: () => void;
    };
  }
}
