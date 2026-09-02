/**
 * ApplicationFieldSet - グループで選ぶ入力にラベル・エラー・ヘルプを付ける
 *
 * ラジオグループ・ボタングループのように「単一のフォームコントロールが無い」入力用。
 *
 * <important>
 * `<label for>` は labelable 要素（button / input / select / textarea / meter /
 * output / progress）にしか効かない。`<div role="radiogroup">` や
 * `<div role="group">` を指しても**ブラウザは黙って無視する**ため、
 * ApplicationFormField（label + htmlFor）をグループへ使うと
 * 「ラベルはあるのにアクセシブル名が無い」状態になる。
 *
 * shadcn/ui もグループには FieldLabel + htmlFor を使わず FieldSet + FieldLegend を
 * 使う。この部品はその形を作り、名前は `aria-labelledby` で結ぶ。
 * </important>
 *
 * 単一のコントロールを持つ入力（Input / Select / Combobox / DatePicker …）は
 * `ApplicationFormField` を使う。
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { FieldDescription, FieldError, FieldLegend, FieldSet } from "../ui/field";

export interface ApplicationFieldSetProps {
  /** グループのラベル */
  label?: React.ReactNode;

  /** 必須マーク（*）を表示する */
  required?: boolean;

  /**
   * エラーメッセージ。渡すと赤字で表示され、グループと aria で紐づく。
   * 空文字・undefined のときは何も表示しない。
   */
  error?: string;

  /** 補足説明。エラーがあるときはエラーを優先し、ヘルプは下に残す */
  helpText?: React.ReactNode;

  /**
   * グループ本体。`aria-labelledby` / `aria-describedby` / `aria-invalid` を
   * 自動で注入する。
   */
  children: React.ReactElement;

  className?: string;
}

/**
 * ApplicationFieldSet コンポーネント
 *
 * @example
 * ```tsx
 * <ApplicationFieldSet label="優先度" required helpText="後から変更できます">
 *   <ApplicationRadioGroup items={PRIORITIES} name="priority" />
 * </ApplicationFieldSet>
 *
 * // エラー付き
 * <ApplicationFieldSet label="表示期間" error="表示期間を選択してください">
 *   <ApplicationButtonGroup items={PERIODS} name="period" />
 * </ApplicationFieldSet>
 * ```
 */
export function ApplicationFieldSet({
  label,
  required = false,
  error,
  helpText,
  children,
  className,
}: ApplicationFieldSetProps) {
  const autoId = React.useId();

  const legendId = label ? `${autoId}-legend` : undefined;
  const errorId = error ? `${autoId}-error` : undefined;
  const helpId = helpText ? `${autoId}-help` : undefined;
  const describedBy = [errorId, helpId].filter(Boolean).join(" ") || undefined;

  /* グループには id / htmlFor ではなく aria-labelledby で名前を与える。
   * <legend> は fieldset の名前にはなるが、中の role="radiogroup" には届かない。 */
  const child = React.cloneElement(children, {
    "aria-labelledby": legendId,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
  } as React.Attributes);

  return (
    <FieldSet
      // ApplicationFormField と同じく、error 時は全体を error 表示へ切り替える
      data-invalid={error ? true : undefined}
      className={cn("gap-1.5", className)}
    >
      {label && (
        <FieldLegend id={legendId} variant="label">
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
        </FieldLegend>
      )}

      {child}

      {error && <FieldError id={errorId}>{error}</FieldError>}

      {helpText && <FieldDescription id={helpId}>{helpText}</FieldDescription>}
    </FieldSet>
  );
}

ApplicationFieldSet.displayName = "ApplicationFieldSet";
