/**
 * HamiriloButtonGroup - shared UI libraryのボタングループ（ラジオボタンのボタン表現）
 *
 * 排他的な選択（どれか1つ）を、隣接したボタンの並びとして表現する。
 * 内部的にはラジオボタン（1つだけ選べる）であり、複数選択は表現できない。
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export interface HamiriloButtonGroupItem {
  /** 選択時の値 */
  value: string;
  /** 表示ラベル */
  label: string;
  /** ラベルの前に表示するアイコン */
  icon?: React.ReactNode;
  /** 選択不可にする */
  disabled?: boolean;
}

export interface HamiriloButtonGroupProps {
  /** 選択肢 */
  items: HamiriloButtonGroupItem[];

  /** 選択値（制御コンポーネントとして使う場合） */
  value?: string;

  /** 初期選択値（非制御の場合） */
  defaultValue?: string;

  /** 選択が変わったときに呼ばれる */
  onValueChange?: (value: string) => void;

  /**
   * 見た目のバリアント
   * - primary: 選択中のボタンを塗りで強調（既定）
   * - secondary: 選択中のボタンを控えめな塗りで示す
   */
  variant?: "primary" | "secondary";

  /** ボタンのサイズ */
  size?: "sm" | "md" | "lg";

  /** 操作不可にする */
  disabled?: boolean;

  /** input の name（通常のフォーム送信に含める場合） */
  name?: string;

  /** 必須 */
  required?: boolean;

  className?: string;

  /**
   * ラベル文字列。
   *
   * <important>
   * 視覚的なラベルが画面上にない場合は `aria-label` か `aria-labelledby` が必須。
   * `HamiriloFormField` で囲む場合はそちらの id が自動で紐づく。
   * </important>
   */
  "aria-label"?: string;

  /** ラベルとなる要素の id（画面上にラベルがある場合はこちらを使う） */
  "aria-labelledby"?: string;
}

/**
 * HamiriloButtonGroup コンポーネント
 *
 * @example
 * ```tsx
 * const items = [
 *   { value: "day", label: "日" },
 *   { value: "week", label: "週" },
 *   { value: "month", label: "月" },
 * ]
 *
 * // 基本
 * <HamiriloButtonGroup items={items} defaultValue="day" aria-label="表示期間" />
 *
 * // 制御付き
 * <HamiriloButtonGroup items={items} value={period} onValueChange={setPeriod} aria-label="表示期間" />
 *
 * // アイコン付き
 * <HamiriloButtonGroup
 *   items={[
 *     { value: "list", label: "リスト", icon: <List /> },
 *     { value: "grid", label: "グリッド", icon: <Grid /> },
 *   ]}
 *   aria-label="表示形式"
 * />
 * ```
 */
export const HamiriloButtonGroup = React.forwardRef<HTMLDivElement, HamiriloButtonGroupProps>(
  (
    {
      items,
      value,
      defaultValue,
      onValueChange,
      variant = "primary",
      size = "md",
      disabled = false,
      name,
      required,
      className,
      ...aria
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
        name={name}
        required={required}
        className={cn("inline-flex", className)}
        {...aria}
      >
        {items.map((item) => (
          <RadioGroupItem
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            variant={variant}
            size={size}
          >
            {item.icon}
            {item.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
    );
  },
);

HamiriloButtonGroup.displayName = "HamiriloButtonGroup";
