/**
 * ApplicationRadioGroup - 共有 UI ライブラリのラジオボタングループ（縦並び・ドット表示）
 *
 * 排他的な選択（どれか1つ）を、フォームの選択肢として縦並びに表示する。
 * 隣接ボタンが1本の枠に見える見た目が欲しい場合は `ApplicationButtonGroup` を使う。
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { Radio } from "../ui/radio";
import { RadioGroup } from "../ui/radio-group";

export interface ApplicationRadioGroupItem {
  /** 選択時の値 */
  value: string;
  /** 表示ラベル */
  label: React.ReactNode;
  /** ラベル下の補足説明 */
  description?: React.ReactNode;
  /** 選択不可にする */
  disabled?: boolean;
}

export interface ApplicationRadioGroupProps {
  /** 選択肢 */
  items: ApplicationRadioGroupItem[];

  /** 選択値（制御コンポーネントとして使う場合） */
  value?: string;

  /** 初期選択値（非制御の場合） */
  defaultValue?: string;

  /** 選択が変わったときに呼ばれる */
  onValueChange?: (value: string) => void;

  /**
   * 選択肢の並び方向
   * @default "vertical"
   */
  orientation?: "horizontal" | "vertical";

  /** 操作不可にする */
  disabled?: boolean;

  /** 必須 */
  required?: boolean;

  /** input の name（通常のフォーム送信に含める場合） */
  name?: string;

  className?: string;
}

const ORIENTATION_CLASS = {
  vertical: "flex-col gap-2.5",
  horizontal: "flex-row flex-wrap gap-4",
} as const;

/**
 * ApplicationRadioGroup コンポーネント
 *
 * @example
 * ```tsx
 * const items = [
 *   { value: "high", label: "高" },
 *   { value: "mid",  label: "中" },
 *   { value: "low",  label: "低" },
 * ]
 *
 * // 基本
 * <ApplicationRadioGroup items={items} defaultValue="mid" />
 *
 * // 制御付き
 * <ApplicationRadioGroup items={items} value={v} onValueChange={setV} />
 *
 * // 横並び
 * <ApplicationRadioGroup items={items} orientation="horizontal" />
 * ```
 */
export const ApplicationRadioGroup = React.forwardRef<HTMLDivElement, ApplicationRadioGroupProps>(
  (
    {
      items,
      value,
      defaultValue,
      onValueChange,
      orientation = "vertical",
      disabled = false,
      required,
      name,
      className,
    },
    ref,
  ) => {
    return (
      <RadioGroup
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange as (v: unknown) => void}
        disabled={disabled}
        required={required}
        name={name}
        className={cn("flex", ORIENTATION_CLASS[orientation], className)}
      >
        {items.map((item) => {
          const autoId = `${name ?? "application-radio"}-${item.value}`;
          const descId = item.description ? `${autoId}-desc` : undefined;

          return (
            <div key={item.value} className="flex items-start gap-2">
              <Radio
                id={autoId}
                value={item.value}
                disabled={item.disabled}
                aria-describedby={descId}
                className="mt-0.5"
              />
              <div className="min-w-0">
                <label
                  htmlFor={autoId}
                  className={cn(
                    "block cursor-pointer text-sm text-foreground",
                    item.disabled && "cursor-not-allowed opacity-60",
                  )}
                >
                  {item.label}
                </label>
                {item.description && (
                  <p id={descId} className="mt-0.5 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </RadioGroup>
    );
  },
);

ApplicationRadioGroup.displayName = "ApplicationRadioGroup";
