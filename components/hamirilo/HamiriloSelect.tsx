/**
 * HamiriloSelect - shared UI libraryのセレクトボックス
 *
 * 見た目は server-rendered markupの `select.input-field` に揃えている。
 *
 * <important>
 * 選択肢が多く検索が必要な場合（部署選択・社員選択など）は HamiriloSelect を使わない。
 * server-rendered application 側は Tom Select、React 側は @base-ui/react の Autocomplete を検討する。
 * HamiriloSelect は選択肢が十数個までの用途に限る。
 * </important>
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface HamiriloSelectItem {
  /** 選択時の値 */
  value: string;
  /** 表示ラベル */
  label: string;
  /** 選択不可にする */
  disabled?: boolean;
  /** グループ見出し（同じ文字列が続く項目がまとめられる） */
  group?: string;
}

export interface HamiriloSelectProps {
  /** 選択肢 */
  items: HamiriloSelectItem[];

  /** 選択値（制御コンポーネントとして使う場合） */
  value?: string | null;

  /** 初期選択値（非制御の場合） */
  defaultValue?: string | null;

  /** 選択が変わったときに呼ばれる */
  onValueChange?: (value: string) => void;

  /** 未選択時に表示する文字列 */
  placeholder?: string;

  /** 操作不可にする */
  disabled?: boolean;

  /**
   * エラー状態。枠線が danger 色になる。
   * 色だけに頼らずエラーメッセージも表示すること（HamiriloFormField が自動で行う）。
   */
  error?: boolean;

  /** input の name（通常のフォーム送信に含める場合） */
  name?: string;

  /** 必須 */
  required?: boolean;

  id?: string;
  className?: string;

  /**
   * ラベル文字列。
   *
   * <important>
   * トリガーは `role="combobox"` になる。ARIA はこのロールに
   * 「中身の文字列を名前として使う」ことを認めていないため、
   * 選択中の値や placeholder があってもアクセシブルな名前にならない。
   * `HamiriloFormField` で囲まない場合は `aria-label` か `aria-labelledby` が必須。
   * </important>
   */
  "aria-label"?: string;

  /** ラベルとなる要素の id（画面上にラベルがある場合はこちらを使う） */
  "aria-labelledby"?: string;

  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

/**
 * HamiriloSelect コンポーネント
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
 * <HamiriloSelect items={items} placeholder="優先度を選択" />
 *
 * // 制御付き
 * <HamiriloSelect items={items} value={v} onValueChange={setV} />
 *
 * // グループ分け
 * <HamiriloSelect items={[
 *   { value: "a", label: "営業部", group: "本社" },
 *   { value: "b", label: "製造部", group: "工場" },
 * ]} />
 * ```
 */
export const HamiriloSelect = React.forwardRef<HTMLButtonElement, HamiriloSelectProps>(
  (
    {
      items,
      value,
      defaultValue,
      onValueChange,
      placeholder = "選択してください",
      disabled = false,
      error = false,
      name,
      required,
      id,
      className,
      ...aria
    },
    ref,
  ) => {
    // group が付いている項目をまとめる。順序は items の出現順を保つ。
    const groups = React.useMemo(() => {
      const out: Array<{ name: string | undefined; items: HamiriloSelectItem[] }> = [];
      for (const item of items) {
        const last = out[out.length - 1];
        if (last && last.name === item.group) last.items.push(item);
        else out.push({ name: item.group, items: [item] });
      }
      return out;
    }, [items]);

    return (
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange as (v: unknown) => void}
        disabled={disabled}
        name={name}
        required={required}
      >
        <SelectTrigger
          ref={ref}
          id={id}
          className={cn(error && "border-danger focus-visible:ring-danger", className)}
          {...aria}
        >
          <SelectValue placeholder={<span className="text-muted-foreground">{placeholder}</span>} />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group, gi) =>
            group.name ? (
              <SelectGroup key={`${group.name}-${gi}`}>
                <SelectGroupLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.name}
                </SelectGroupLabel>
                {group.items.map((item) => (
                  <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ) : (
              group.items.map((item) => (
                <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                  {item.label}
                </SelectItem>
              ))
            ),
          )}
        </SelectContent>
      </Select>
    );
  },
);

HamiriloSelect.displayName = "HamiriloSelect";
