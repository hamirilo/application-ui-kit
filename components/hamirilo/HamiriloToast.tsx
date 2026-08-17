/**
 * HamiriloToast - shared UI libraryのトースト通知コンポーネント
 *
 * shadcn/ui の Toast をラップし、簡潔な API でトースト通知を表示します。
 * プロジェクトの通知はすべてこの HamiriloToast に一本化します。
 *
 * 使い方は 3 経路あり、いずれも同じトーストに集約されます:
 *
 * 1. React (Island) 内から:
 *      import { HamiriloToast } from '../dx'
 *      HamiriloToast.success("保存しました")
 *      HamiriloToast.error("保存に失敗しました", "ネットワークエラーです")
 *
 * 2. 素の JS / application JavaScript / server-rendering から（グローバル関数）:
 *      window.HamiriloToast.success("保存しました")
 *      // 後方互換: 既存の window.showToast(text, type) も HamiriloToast に転送される
 *
 * 3. server-rendered application messages から（自動）:
 *      messages.success(request, "保存しました")
 *      → ページ読込時に ToastListenerIsland が自動でトースト表示
 *
 * アイコンは variant に応じて Toaster 側（toaster.tsx）で自動描画されます。
 * ここでは title / description は必ずプレーンな文字列を渡します。
 */

import { toast as shadcnToast } from "../../hooks/use-toast";

/** トーストのタイプ（見た目と variant を決定） */
export type HamiriloToastType = "success" | "error" | "warning" | "info";

export interface HamiriloToastOptions {
  /** トーストのタイトル（1 行目・強調表示） */
  title?: string;
  /** トーストの説明文（2 行目・補足） */
  description?: string;
  /** トーストのタイプ @default "info" */
  type?: HamiriloToastType;
  /** 表示時間（ミリ秒） @default 5000 */
  duration?: number;
}

const DEFAULT_DURATION = 5000;

/** HamiriloToastType → shadcn Toast variant のマッピング */
const VARIANT_MAP: Record<
  HamiriloToastType,
  "default" | "destructive" | "success" | "warning" | "info"
> = {
  success: "success",
  error: "destructive",
  warning: "warning",
  info: "info",
};

function showToast(
  type: HamiriloToastType,
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

/**
 * HamiriloToast - トースト通知を表示する API
 *
 * @example
 * HamiriloToast.success("保存しました")
 * HamiriloToast.error("保存に失敗しました", "ネットワークエラーが発生しました。")
 * HamiriloToast.warning("注意", "この操作は取り消せません。")
 * HamiriloToast.info("お知らせ", "新しいバージョンが利用可能です。")
 */
export const HamiriloToast = {
  /** 成功通知（緑） */
  success: (title: string, description?: string, duration?: number) =>
    showToast("success", title, description, duration),

  /** エラー通知（赤） */
  error: (title: string, description?: string, duration?: number) =>
    showToast("error", title, description, duration),

  /** 警告通知（オレンジ） */
  warning: (title: string, description?: string, duration?: number) =>
    showToast("warning", title, description, duration),

  /** 情報通知（青） */
  info: (title: string, description?: string, duration?: number) =>
    showToast("info", title, description, duration),

  /** カスタム通知 */
  show: (options: HamiriloToastOptions) => {
    const { type = "info", title = "", description, duration } = options;
    showToast(type, title, description, duration);
  },
};

/**
 * HamiriloToast をグローバルに公開する。
 *
 * 素の server-rendered markup・application JavaScript・server-rendering から `window.HamiriloToast.success(...)` で呼べる。
 * また、既存コードが使っている `window.showToast(text, type)` も HamiriloToast に転送し、
 * alert() / 独自メッセージ / Bootstrap 風通知をすべて HamiriloToast に一本化する。
 *
 * ※ HamiriloToaster が DOM にマウントされている前提（base.html で常時マウント）。
 */
export function registerGlobalDxToast() {
  if (typeof window === "undefined") return;

  // React マウント前に window.showToast が呼ばれていた場合、
  // ブートストラップスタブがキューに溜めている分をここで消化する。
  const queued = window.__dxToastQueue;
  window.HamiriloToast = HamiriloToast;

  const toType = (type?: string): HamiriloToastType =>
    type === "success" || type === "error" || type === "warning" || type === "info" ? type : "info";

  // 後方互換 1: window.showToast(text, type) → HamiriloToast
  window.showToast = (text: string, type?: string) => {
    HamiriloToast[toType(type)](text);
  };

  // 後方互換 2: document.dispatchEvent(new CustomEvent('showToast', {detail:{message,type}}))
  // 一部テンプレート（locations/visits 等）はこの DOM イベントで通知していたため転送する。
  if (!window.__dxToastEventBound) {
    document.addEventListener("showToast", (e: Event) => {
      const detail = (e as CustomEvent<{ message?: string; type?: string }>).detail;
      if (!detail) return;
      HamiriloToast[toType(detail.type)](detail.message || "");
    });
    window.__dxToastEventBound = true;
  }

  // ブートストラップスタブが溜めた早期呼び出しを消化
  if (queued?.length) {
    queued.forEach(([text, type]) => HamiriloToast[toType(type)](text));
    window.__dxToastQueue = [];
  }
}

/**
 * HamiriloToaster - トースト通知のプロバイダーコンポーネント
 *
 * base.html（全ページ共通）に 1 つマウントしてください。
 */
export { Toaster as HamiriloToaster } from "../ui/toaster";

declare global {
  interface Window {
    HamiriloToast: typeof HamiriloToast;
    showToast: (text: string, type?: string) => void;
    __dxToastEventBound?: boolean;
    __dxToastQueue?: Array<[string, string | undefined]>;
  }
}
