/**
 * ApplicationSearchInput - shared UI libraryの検索入力コンポーネント
 *
 * ApplicationInput + 検索アイコン + クリアボタンをまとめたもの。
 * 一覧・テーブルの上に置くフィルタ用検索欄で使う。
 *
 * <important>
 * ラベルを視覚的に置かない場面が多いため、`aria-label` を必ず渡すこと
 * （ApplicationFormField で囲む場合は不要）。
 * </important>
 */

import { Search, X } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { ApplicationInput, type ApplicationInputProps } from "./ApplicationInput";

export interface ApplicationSearchInputProps
  extends Omit<ApplicationInputProps, "leftIcon" | "rightIcon" | "type"> {
  /**
   * クリアボタンを押したときのコールバック。
   * 渡すと値がある間だけクリアボタン（×）が表示される。
   */
  onClear?: () => void;
}

/**
 * ApplicationSearchInput コンポーネント
 *
 * @example
 * ```tsx
 * // 基本（非制御）
 * <ApplicationSearchInput aria-label="検索" placeholder="タイトルで検索" />
 *
 * // 制御付き + クリアボタン
 * <ApplicationSearchInput
 *   aria-label="検索"
 *   placeholder="タイトルで検索"
 *   value={keyword}
 *   onChange={(e) => setKeyword(e.target.value)}
 *   onClear={() => setKeyword("")}
 * />
 * ```
 */
export const ApplicationSearchInput = React.forwardRef<
  HTMLInputElement,
  ApplicationSearchInputProps
>(({ className, onClear, value, ...props }, ref) => {
  const hasValue = value !== undefined && value !== "";

  return (
    <ApplicationInput
      ref={ref}
      type="search"
      value={value}
      className={cn("[&::-webkit-search-cancel-button]:hidden", className)}
      leftIcon={<Search className="h-4 w-4" />}
      rightIcon={
        onClear && hasValue ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="検索キーワードをクリア"
            className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : undefined
      }
      {...props}
    />
  );
});

ApplicationSearchInput.displayName = "ApplicationSearchInput";
