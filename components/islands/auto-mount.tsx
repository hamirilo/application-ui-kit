/**
 * React Islands - 自動マウントエントリ（副作用あり）
 *
 * `data-react="component-name"` を持つ要素をすべて見つけ、レジストリの
 * React コンポーネントをマウントします。アプリの Vite エントリで
 * import するだけで動きます:
 *
 *   // islands/main.ts
 *   import 'application-ui-kit/islands/auto-mount'
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

registerIslandComponents({
  "confirm-dialog": ConfirmDialogIsland,
  "form-dialog": FormDialogIsland,
  "toast-listener": ToastListenerIsland,
  "date-picker": DatePickerIsland,
});

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

export function initializeIslands(): void {
  const islands = document.querySelectorAll<HTMLElement>("[data-react]");

  islands.forEach((element) => {
    const componentName = element.dataset.react;

    if (!componentName) {
      console.warn("[React Islands] Found element with empty data-react");
      return;
    }

    if (element.dataset.reactMounted === "true") {
      return;
    }

    mountIsland(element, componentName);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeIslands);
} else {
  initializeIslands();
}

if (typeof window.htmx !== "undefined") {
  document.body.addEventListener("htmx:afterSwap", () => {
    initializeIslands();
  });
}

window.ReactIslands = {
  mount: mountIsland,
  initialize: initializeIslands,
};
