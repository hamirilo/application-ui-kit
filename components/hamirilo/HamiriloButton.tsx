/**
 * HamiriloButton - shared UI libraryのボタンコンポーネント
 *
 * shadcn/ui の Button をラップし、プロジェクト固有のバリアント・スタイルを提供します。
 * 画面側では HamiriloButton のみを使用し、shadcn/ui の Button を直接使用しないでください。
 */

import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Button, type ButtonProps } from "../ui/button";

export interface HamiriloButtonProps extends Omit<ButtonProps, "variant"> {
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
 * HamiriloButton コンポーネント
 *
 * @example
 * ```tsx
 * // 基本的な使い方
 * <HamiriloButton>保存</HamiriloButton>
 *
 * // バリアント指定
 * <HamiriloButton variant="primary">作成</HamiriloButton>
 * <HamiriloButton variant="danger">削除</HamiriloButton>
 *
 * // ローディング状態
 * <HamiriloButton loading>送信中...</HamiriloButton>
 *
 * // アイコン付き
 * <HamiriloButton leftIcon={<Plus className="w-4 h-4" />}>追加</HamiriloButton>
 *
 * // サイズ指定
 * <HamiriloButton size="sm">小さいボタン</HamiriloButton>
 * <HamiriloButton size="lg">大きいボタン</HamiriloButton>
 *
 * // 無効化
 * <HamiriloButton disabled>無効</HamiriloButton>
 *
 * // フルワイド
 * <HamiriloButton className="w-full">幅いっぱい</HamiriloButton>
 * ```
 */
export const HamiriloButton = React.forwardRef<HTMLButtonElement, HamiriloButtonProps>(
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
    // DX variant を shadcn/ui variant にマッピング
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

HamiriloButton.displayName = "HamiriloButton";
