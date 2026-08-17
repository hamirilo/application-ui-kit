/**
 * ApplicationFormField - ラベル + 入力 + エラー + ヘルプをまとめるフォーム部品
 *
 * markupの `includes/molecules/form_field.html` の React 版。
 * 余白・必須マーク・エラー表示のルールをここに集約し、画面ごとのばらつきを防ぐ。
 *
 * 余白は design-system/components.md の規約に合わせて固定している:
 *   ラベル下 mb-1.5 / エラー上 mt-1.5 / ヘルプ上 mt-1
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ApplicationFormFieldProps {
  /** ラベル文字列 */
  label?: React.ReactNode;

  /** 必須マーク（*）を表示する */
  required?: boolean;

  /**
   * エラーメッセージ。渡すと赤字で表示され、入力欄と aria で紐づく。
   * 空文字・undefined のときは何も表示しない。
   */
  error?: string;

  /** 補足説明。エラーがあるときはエラーを優先し、ヘルプは下に残す */
  helpText?: React.ReactNode;

  /**
   * 入力欄。`<ApplicationInput>` / `<ApplicationSelect>` / `<textarea>` 等を渡す。
   * id / aria-describedby / aria-invalid は自動で注入される。
   */
  children: React.ReactElement;

  /**
   * 入力欄の id。省略時は自動生成する。
   * application フォームと紐づける場合は `field.id_for_label` を渡す。
   */
  htmlFor?: string;

  className?: string;
}

/**
 * ApplicationFormField コンポーネント
 *
 * @example
 * ```tsx
 * <ApplicationFormField label="件名" required>
 *   <ApplicationInput placeholder="例: 〇〇の改善について" />
 * </ApplicationFormField>
 *
 * // エラー付き（error を渡すと子の ApplicationInput も自動で赤枠になる）
 * <ApplicationFormField label="メールアドレス" error="形式が正しくありません">
 *   <ApplicationInput defaultValue="foo@" />
 * </ApplicationFormField>
 *
 * // ヘルプ付き
 * <ApplicationFormField label="公開範囲" helpText="後から変更できます">
 *   <ApplicationSelect items={items} />
 * </ApplicationFormField>
 * ```
 */
export function ApplicationFormField({
  label,
  required = false,
  error,
  helpText,
  children,
  htmlFor,
  className,
}: ApplicationFormFieldProps) {
  const autoId = React.useId();
  const id = htmlFor ?? (children.props as { id?: string }).id ?? autoId;

  const errorId = error ? `${id}-error` : undefined;
  const helpId = helpText ? `${id}-help` : undefined;
  const describedBy = [errorId, helpId].filter(Boolean).join(" ") || undefined;

  // 子要素に id と a11y 属性を注入する。
  // error は子が受け取れる場合（ApplicationInput / ApplicationSelect）だけ渡す。
  const child = React.cloneElement(children, {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
    ...(error ? { error: true } : {}),
  } as React.Attributes);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
          {required && (
            <>
              <span aria-hidden="true" className="ml-0.5 text-danger">
                *
              </span>
              {/* 「*」だけでは支援技術に必須が伝わらないため文字でも伝える */}
              <span className="sr-only">（必須）</span>
            </>
          )}
        </label>
      )}

      {child}

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}

      {helpText && (
        <p id={helpId} className="mt-1 text-xs text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  );
}

ApplicationFormField.displayName = "ApplicationFormField";
