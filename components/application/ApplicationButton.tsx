/**
 * ApplicationButton - 共有 UI ライブラリのボタンコンポーネント
 *
 * shadcn/ui の Button をラップし、プロジェクト固有のバリアント・スタイルを提供します。
 * 画面側では ApplicationButton のみを使用し、shadcn/ui の Button を直接使用しないでください。
 */

import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Button, type ButtonProps } from "../ui/button";

export interface ApplicationButtonProps extends Omit<ButtonProps, "variant"> {
  /**
   * ボタンのバリアント
   * - primary: メインアクション（作成・送信）- Blue
   * - secondary: 補助操作（キャンセル・戻る）- Gray
   * - danger: 削除・取り消し不可の操作 - Red
   * - success: 保存完了・承認・確定 - Emerald
   * - ghost: 背景なし、ホバーで表示
   * - link: テキストリンク風
   */
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost" | "link";

  /**
   * ローディング状態（スピナーを表示）
   */
  loading?: boolean;

  /**
   * 左側に表示するアイコン
   */
  leftIcon?: React.ReactNode;

  /**
   * 右側に表示するアイコン
   */
  rightIcon?: React.ReactNode;

  /**
   * 子要素
   */
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
 * // ローディング状態
 * <ApplicationButton loading>送信中...</ApplicationButton>
 *
 * // アイコン付き
 * <ApplicationButton leftIcon={<Plus className="w-4 h-4" />}>追加</ApplicationButton>
 *
 * // サイズ指定
 * <ApplicationButton size="sm">小さいボタン</ApplicationButton>
 * <ApplicationButton size="lg">大きいボタン</ApplicationButton>
 *
 * // 無効化
 * <ApplicationButton disabled>無効</ApplicationButton>
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
    // Application variant を shadcn/ui variant にマッピング
    const shadcnVariant = React.useMemo(() => {
      switch (variant) {
        case "primary":
          return "default";
        case "secondary":
          return "outline";
        case "danger":
          return "destructive";
        case "success":
          // success は shadcn/ui にないので、カスタムスタイルを適用
          return "default";
        case "ghost":
          return "ghost";
        case "link":
          return "link";
        default:
          return "default";
      }
    }, [variant]);

    // success バリアントのカスタムスタイル
    // 色は input.css の --color-success トークン（btn-success と共通）に揃える
    const successClassName =
      variant === "success"
        ? "bg-success hover:bg-success-hover text-success-foreground shadow-sm"
        : "";

    return (
      <Button
        ref={ref}
        variant={shadcnVariant}
        disabled={disabled || loading}
        className={cn(successClassName, className)}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {!loading && leftIcon && leftIcon}
        {children}
        {!loading && rightIcon && rightIcon}
      </Button>
    );
  },
);

ApplicationButton.displayName = "ApplicationButton";
