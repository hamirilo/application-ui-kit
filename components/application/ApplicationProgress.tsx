/**
 * ApplicationProgress - 共有 UI ライブラリのプログレスバー
 *
 * ファイルアップロード・複数ステップの処理の進捗表示に使う。
 * 完了までの見込みが分からない処理には使わない（`ApplicationSpinner` を使う）。
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { Progress, ProgressIndicator, ProgressTrack } from "../ui/progress";

export interface ApplicationProgressProps {
  /** 現在値。0〜max の範囲。 */
  value: number;

  /**
   * 最大値
   * @default 100
   */
  max?: number;

  /** プログレスバー上部に表示するラベル */
  label?: React.ReactNode;

  /** 右側に「50%」のような数値表示を出す */
  showValue?: boolean;

  className?: string;
}

/**
 * ApplicationProgress コンポーネント
 *
 * @example
 * ```tsx
 * // 基本
 * <ApplicationProgress value={40} />
 *
 * // ラベル + 数値表示
 * <ApplicationProgress value={progress} label="アップロード中" showValue />
 *
 * // 最大値を変える（3ステップ中2ステップ完了 等）
 * <ApplicationProgress value={2} max={3} label="申請ステップ" />
 * ```
 */
export const ApplicationProgress = React.forwardRef<HTMLDivElement, ApplicationProgressProps>(
  ({ value, max = 100, label, showValue = false, className }, ref) => {
    const percent = Math.round((value / max) * 100);

    return (
      <Progress ref={ref} value={value} max={max} className={cn("w-full", className)}>
        {(label || showValue) && (
          <div className="mb-1.5 flex items-center justify-between gap-2">
            {label && <span className="text-sm text-foreground">{label}</span>}
            {showValue && <span className="text-sm text-muted-foreground">{percent}%</span>}
          </div>
        )}
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    );
  },
);

ApplicationProgress.displayName = "ApplicationProgress";
