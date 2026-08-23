/**
 * ApplicationBadge - 共有 UI ライブラリのバッジ（ステータス表示）コンポーネント
 *
 * shadcn/ui の Badge を土台に、業務ステータス向けの色調（tone）を載せたもの。
 * shadcn/ui の variant（default / secondary / destructive / outline / ghost / link）は
 * 「役割」の表現で、ドメインの状態（未対応・対応中・完了…）を表せないため tone を持つ。
 *
 * <important>
 * バッジは色だけに意味を持たせない。セマンティックカラーは WCAG AA 未達のため、
 * 必ず文字（「完了」「未対応」等）で意味が読み取れるようにする。
 * </important>
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";

export type ApplicationBadgeTone =
  | "new"
  | "active"
  | "done"
  | "warning"
  | "danger"
  | "pending"
  | "neutral";

export interface ApplicationBadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  /**
   * 意味に対応した色調
   * - new: 新規・未対応・要注意（Yellow）
   * - active: 進行中（Sky）
   * - done: 完了・解決・承認（Emerald）
   * - warning: 差戻し・警告（Orange）
   * - danger: 緊急・エラー・却下（Rose）
   * - pending: 検討中・保留（Purple）
   * - neutral: 終了・無効・アーカイブ（Gray）
   * @default "neutral"
   */
  tone?: ApplicationBadgeTone;

  /** 先頭に表示するアイコン */
  icon?: React.ReactNode;
}

const TONE_CLASS: Record<ApplicationBadgeTone, string> = {
  new: "bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400",
  active: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400",
  done: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  warning: "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
  danger: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
  pending: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
  neutral: "bg-muted text-muted-foreground",
};

/**
 * ApplicationBadge コンポーネント
 *
 * @example
 * ```tsx
 * // 基本
 * <ApplicationBadge tone="active">対応中</ApplicationBadge>
 *
 * // 一覧のステータス列
 * <ApplicationBadge tone={statusToneMap[row.status]}>{row.statusLabel}</ApplicationBadge>
 *
 * // アイコン付き
 * <ApplicationBadge tone="danger" icon={<AlertCircleIcon />}>エラー</ApplicationBadge>
 * ```
 */
export const ApplicationBadge = React.forwardRef<HTMLSpanElement, ApplicationBadgeProps>(
  ({ tone = "neutral", icon, children, className, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        // ghost を土台にして tone のユーティリティで色を上書きする。
        // tone は utilities レイヤーなので、cn-badge-variant-* より後勝ちになる。
        variant="ghost"
        className={cn(TONE_CLASS[tone], className)}
        {...props}
      >
        {icon}
        {children}
      </Badge>
    );
  },
);

ApplicationBadge.displayName = "ApplicationBadge";
