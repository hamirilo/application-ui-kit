/**
 * ApplicationFormField - ラベル + 入力 + エラー + ヘルプをまとめるフォーム部品
 *
 * shadcn/ui の Field 一式（Field / FieldLabel / FieldError / FieldDescription）を土台に、
 * id・aria-describedby・aria-invalid の結線を**自動で**行う。
 *
 * shadcn/ui の Field は compound で自由度が高い代わりに、この結線が利用者任せになる。
 * 画面ごとに書き忘れるとエラーが支援技術に伝わらないため、ここで面倒を見る。
 * 自由なレイアウトが必要な場合は Field を直接使ってよい。
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";

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
   * 入力欄。`<ApplicationInput>` / `<ApplicationSelect>` / `<Textarea>` 等を渡す。
   * id / aria-describedby / aria-invalid は自動で注入される。
   */
  children: React.ReactElement;

  /**
   * 入力欄の id。省略時は自動生成する。
   * サーバー側のフォームと紐づける場合は `field.id_for_label` を渡す。
   */
  htmlFor?: string;

  /**
   * ラベルと入力欄の並び
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal" | "responsive";

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
 * // エラー付き（error を渡すと子も自動で aria-invalid になり赤枠になる）
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
  orientation = "vertical",
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
    <Field orientation={orientation} className={cn("gap-1.5", className)}>
      {label && (
        <FieldLabel htmlFor={id}>
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
        </FieldLabel>
      )}

      {child}

      {error && (
        <FieldError id={errorId} className="text-danger">
          {error}
        </FieldError>
      )}

      {helpText && <FieldDescription id={helpId}>{helpText}</FieldDescription>}
    </Field>
  );
}

ApplicationFormField.displayName = "ApplicationFormField";
