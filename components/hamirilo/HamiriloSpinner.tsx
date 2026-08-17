/**
 * HamiriloSpinner - shared UI libraryのローディングインジケーター
 *
 * ボタン内のローディングは HamiriloButton の `loading` prop を使う。
 * HamiriloSpinner はページ・カード・セクション単位の読み込み中表示で使う。
 */

import { Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

export type HamiriloSpinnerSize = "xs" | "sm" | "md" | "lg";

export interface HamiriloSpinnerProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /**
   * サイズ
   * @default "md"
   */
  size?: HamiriloSpinnerSize;

  /**
   * 読み上げ用のラベル。スクリーンリーダーに「読み込み中」であることを伝える。
   * @default "読み込み中"
   */
  label?: string;
}

const SIZE_CLASS: Record<HamiriloSpinnerSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

/**
 * HamiriloSpinner コンポーネント
 *
 * @example
 * ```tsx
 * // 基本（カード内の読み込み中）
 * <HamiriloCard>
 *   <div className="flex justify-center py-8">
 *     <HamiriloSpinner />
 *   </div>
 * </HamiriloCard>
 *
 * // サイズ指定
 * <HamiriloSpinner size="lg" />
 *
 * // ラベル付きで文脈を伝える
 * <HamiriloSpinner label="申請一覧を読み込み中" />
 * ```
 */
export const HamiriloSpinner = React.forwardRef<HTMLDivElement, HamiriloSpinnerProps>(
  ({ size = "md", label = "読み込み中", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        className={cn("inline-flex items-center justify-center", className)}
        {...props}
      >
        <Loader2 className={cn("animate-spin text-muted-foreground", SIZE_CLASS[size])} />
        <span className="sr-only">{label}</span>
      </div>
    );
  },
);

HamiriloSpinner.displayName = "HamiriloSpinner";
