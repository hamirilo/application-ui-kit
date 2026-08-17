/**
 * HamiriloCard - shared UI libraryのカードコンポーネント
 *
 * 見た目は server-rendered markupの `.card` / `.card-sm` / `.card-lg` に揃えている。
 *
 * <important>
 * server-rendered markup（.html）では `<div class="card">` を使う。
 * HamiriloCard は React application の中でだけ使う。
 * </important>
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export type HamiriloCardPadding = "sm" | "md" | "lg";

// title は HTML の title 属性（ツールチップ）と名前が衝突するため Omit する。
// カード見出しは文字列以外（アイコン付き等）も受けたいので ReactNode で再定義する。
export interface HamiriloCardProps extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
  /**
   * 内側の余白。CSS クラスと対応する
   * - sm: `.card-sm`（p-3）
   * - md: `.card`（p-4）標準
   * - lg: `.card-lg`（p-6）
   * @default "md"
   */
  padding?: HamiriloCardPadding;

  /** カード上部の見出し。文字列を渡すと h3 相当で描画される */
  title?: React.ReactNode;

  /** 見出しの右側に置くアクション（ボタン・メニュー等） */
  action?: React.ReactNode;

  /** カード下部のフッター（区切り線付き） */
  footer?: React.ReactNode;
}

const PADDING_CLASS: Record<HamiriloCardPadding, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

/**
 * HamiriloCard コンポーネント
 *
 * @example
 * ```tsx
 * // 基本
 * <HamiriloCard>コンテンツ</HamiriloCard>
 *
 * // 見出し + アクション
 * <HamiriloCard title="申請一覧" action={<HamiriloButton size="sm">追加</HamiriloButton>}>
 *   <p>本文</p>
 * </HamiriloCard>
 *
 * // フッター付き
 * <HamiriloCard title="確認" footer={<HamiriloButton>保存</HamiriloButton>}>
 *   <p>本文</p>
 * </HamiriloCard>
 * ```
 */
export const HamiriloCard = React.forwardRef<HTMLDivElement, HamiriloCardProps>(
  ({ className, padding = "md", title, action, footer, children, ...props }, ref) => {
    const hasHeader = Boolean(title || action);

    return (
      <div
        ref={ref}
        className={cn(
          // `.card` と同じ: 角丸 xl・shadow-sm のみ・1px ボーダー
          "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
          PADDING_CLASS[padding],
          className,
        )}
        {...props}
      >
        {hasHeader && (
          <div className="mb-3 flex items-start justify-between gap-3">
            {title && <h3 className="text-base font-semibold leading-tight">{title}</h3>}
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}

        {children}

        {footer && (
          <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
            {footer}
          </div>
        )}
      </div>
    );
  },
);

HamiriloCard.displayName = "HamiriloCard";
