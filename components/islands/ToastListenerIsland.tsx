/**
 * ToastListenerIsland - 全ページ共通のトースト通知ハブ（Django テンプレート用）
 *
 * base.html に 1 つだけ置くことで、プロジェクト全体の通知が ApplicationToast に
 * 一本化されます。責務は次の 3 つ:
 *
 * 1. ApplicationToaster（トーストの表示領域）をマウントする
 *    → 表示領域はページに 1 つだけ。他の Island は表示領域を持たず、ここに相乗りする
 * 2. window.ApplicationToast をグローバル登録する
 *    → 素の JS・htmx から window.ApplicationToast.success(...) で呼べる
 * 3. Django messages を初期表示する
 *    → data-messages に渡された messages.success()/error() をトースト化
 *
 * Django テンプレート（base.html）での使い方:
 *
 * ```html
 * <div
 *   data-react="toast-listener"
 *   data-messages='[{"text": "保存しました", "type": "success"}]'
 * ></div>
 * ```
 *
 * data-messages は Django の messages を JSON 化したもの。空なら省略可。
 * 文字列連結で JSON を埋め込まず、`json_script` 等の安全なシリアライズ手段を使うか、
 * テンプレートフィルタでエスケープしてください。
 */

import { useEffect } from "react";
import {
  ApplicationToast,
  type ApplicationToastType,
  ApplicationToaster,
} from "../application/ApplicationToast";
import "./types";

interface DjangoMessage {
  text: string;
  type: ApplicationToastType;
}

export interface ToastListenerIslandProps {
  /** Django messages を JSON 化した配列（オプション） */
  messages?: DjangoMessage[];
}

export function ToastListenerIsland({ messages }: ToastListenerIslandProps) {
  // グローバル関数を登録（一度だけ）
  useEffect(() => {
    window.ApplicationToast = ApplicationToast;
  }, []);

  // Django messages を初期表示（複数は少しずつずらして表示）
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const timers = messages.map((msg, index) =>
      window.setTimeout(() => {
        const type: ApplicationToastType =
          msg.type === "success" ||
          msg.type === "error" ||
          msg.type === "warning" ||
          msg.type === "info"
            ? msg.type
            : "info";
        ApplicationToast[type](msg.text);
      }, index * 200),
    );
    return () => {
      for (const t of timers) {
        window.clearTimeout(t);
      }
    };
  }, [messages]);

  return <ApplicationToaster />;
}
