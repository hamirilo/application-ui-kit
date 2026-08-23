/**
 * ApplicationButton - 共有 UI ライブラリのボタンコンポーネント
 *
 * shadcn/ui の Button をラップし、このリポジトリの意味論的なバリアント名
 * （primary / secondary / danger / success）と `loading` を提供する。
 * 画面側では ApplicationButton のみを使用し、shadcn/ui の Button を直接使用しないでください。
 *
 * shadcn/ui 本体に `loading` はなく、利用側が Spinner を手で差し込む前提になっている。
 * 送信中にボタンを無効化し忘れる事故を防ぐため、ここで面倒を見る。
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

/** このリポジトリの意味論的な名前 → shadcn/ui のバリアント名 */
const VARIANT_MAP = {
  primary: "default",
  secondary: "outline",
  danger: "destructive",
  success: "success",
  ghost: "ghost",
  link: "link",
} as const;

export type ApplicationButtonVariant = keyof typeof VARIANT_MAP;

export interface ApplicationButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "variant"> {
  /**
   * ボタンのバリアント
   * - primary: メインアクション（作成・送信）- Blue
   * - secondary: 補助操作（キャンセル・戻る）- Gray
   * - danger: 削除・取り消し不可の操作 - Red
   * - success: 保存完了・承認・確定 - Emerald
   * - ghost: 背景なし、ホバーで表示
   * - link: テキストリンク風
   * @default "primary"
   */
  variant?: ApplicationButtonVariant;

  /**
   * ローディング状態。true の間はスピナーを表示し、ボタンを無効化する。
   * leftIcon / rightIcon はスピナーに置き換わる。
   */
  loading?: boolean;

  /** 左側に表示するアイコン */
  leftIcon?: React.ReactNode;

  /** 右側に表示するアイコン */
  rightIcon?: React.ReactNode;

  children?: React.ReactNode;
}

/**
 * ApplicationButton コンポーネント
 *
 * @example
 * ```tsx
 * // 基本的な使い方
 * <ApplicationButton>保存</ApplicationButton>
 *
 * // バリアント指定
 * <ApplicationButton variant="primary">作成</ApplicationButton>
 * <ApplicationButton variant="danger">削除</ApplicationButton>
 *
 * // ローディング状態（自動で disabled になる）
 * <ApplicationButton loading>送信中...</ApplicationButton>
 *
 * // アイコン付き
 * <ApplicationButton leftIcon={<PlusIcon />}>追加</ApplicationButton>
 *
 * // サイズ指定
 * <ApplicationButton size="sm">小さいボタン</ApplicationButton>
 * <ApplicationButton size="lg">大きいボタン</ApplicationButton>
 *
 * // フルワイド
 * <ApplicationButton className="w-full">幅いっぱい</ApplicationButton>
 * ```
 */
export const ApplicationButton = React.forwardRef<HTMLButtonElement, ApplicationButtonProps>(
  (
    {
      variant = "primary",
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        variant={VARIANT_MAP[variant]}
        disabled={disabled || loading}
        // 処理中であることを支援技術にも伝える（見た目のスピナーだけに頼らない）
        aria-busy={loading || undefined}
        className={cn("gap-2", className)}
        {...props}
      >
        {loading ? <Spinner /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </Button>
    );
  },
);

ApplicationButton.displayName = "ApplicationButton";
