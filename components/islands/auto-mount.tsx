/**
 * React Islands - 自動マウントエントリ（副作用あり）
 *
 * `data-react="component-name"` を持つ要素をすべて見つけ、レジストリの
 * React コンポーネントをマウントします。アプリの Vite エントリで
 * import するだけで動きます:
 *
 *   // islands/main.ts
 *   import '@<owner>/application-ui-kit/islands/auto-mount'
 *
 * Django テンプレートでの使い方:
 *   1. エントリを読み込む: {% vite_asset 'main' %}
 *   2. マウントポイントを置く: <div data-react="component-name" data-props='{"key": "value"}'></div>
 *
 * props の渡し方（parse-props.ts 参照）:
 *   - data-props='{"key": "value"}'（JSON 文字列）
 *   - 個別の data-* 属性（例: data-title="Hello"）
 *
 * このパッケージ標準の 4 Island は自動登録されます:
 *   confirm-dialog / form-dialog / toast-listener / date-picker
 * アプリ固有の Island は registerIslandComponents() で追加します。
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfirmDialogIsland } from "./ConfirmDialogIsland";
import { DatePickerIsland } from "./DatePickerIsland";
import { FormDialogIsland } from "./FormDialogIsland";
import { ToastListenerIsland } from "./ToastListenerIsland";
import { parseProps } from "./parse-props";
import {
  getIslandComponent,
  getRegisteredIslandComponents,
  registerIslandComponents,
} from "./registry";
import "./types";

// このパッケージ標準の Island を登録する
registerIslandComponents({
  "confirm-dialog": ConfirmDialogIsland,
  "form-dialog": FormDialogIsland,
  "toast-listener": ToastListenerIsland,
  "date-picker": DatePickerIsland,
});

/**
 * 1 つの要素へ React コンポーネントをマウントする
 */
export function mountIsland(element: HTMLElement, componentName: string): void {
  const Component = getIslandComponent(componentName);

  if (!Component) {
    console.error(
      `[React Islands] Component "${componentName}" not found in registry.`,
      `Available components: ${getRegisteredIslandComponents().join(", ") || "none"}`,
    );
    return;
  }

  try {
    const props = parseProps(element);
    const root = createRoot(element);
    element.dataset.reactMounted = "true";

    root.render(
      <StrictMode>
        <Component {...props} />
      </StrictMode>,
    );
  } catch (error) {
    console.error(`[React Islands] Failed to mount "${componentName}":`, error);
  }
}

/**
 * ページ上のすべての Island をマウントする
 * DOM 準備完了時と htmx スワップ後に自動で呼ばれる
 */
export function initializeIslands(): void {
  const islands = document.querySelectorAll<HTMLElement>("[data-react]");

  islands.forEach((element) => {
    const componentName = element.dataset.react;

    if (!componentName) {
      console.warn("[React Islands] Found element with empty data-react");
      return;
    }

    if (element.dataset.reactMounted === "true") {
      // htmx:afterSwap は document 全体を再スキャンするため、スワップ範囲外の
      // 既存 Island（例: body 直下の toast-listener）を毎回再マウントしてしまう。
      // createRoot() は同じコンテナに対して 1 回しか呼べないため、二重マウントを防ぐ。
      return;
    }

    mountIsland(element, componentName);
  });
}

/**
 * DOM 準備完了時にマウントする
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeIslands);
} else {
  // DOM はすでに準備完了
  initializeIslands();
}

/**
 * htmx が新しいコンテンツをスワップした後に再マウントする
 * 動的に読み込まれた HTML 内の Island を有効にするため
 */
if (typeof window.htmx !== "undefined") {
  document.body.addEventListener("htmx:afterSwap", () => {
    initializeIslands();
  });
}

/**
 * 手動マウント用のグローバル API
 * 使い方: window.ReactIslands.mount(element, 'component-name')
 */
window.ReactIslands = {
  mount: mountIsland,
  initialize: initializeIslands,
};
