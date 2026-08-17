/**
 * ApplicationPagination - shared UI libraryのページネーション
 *
 * ApplicationTable など一覧の下に置く。ページ番号は 1 始まり。
 *
 * <important>
 * ページ番号の計算・現在ページの保持は画面側（またはサーバー）の責務。
 * このコンポーネントは見た目とキーボード操作だけを提供する。
 * </important>
 */

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface ApplicationPaginationProps {
  /** 現在のページ（1 始まり） */
  page: number;

  /** 総ページ数 */
  totalPages: number;

  /** ページが変わったときに呼ばれる */
  onPageChange: (page: number) => void;

  /** 現在ページの前後に表示するページ数 */
  siblingCount?: number;

  className?: string;
}

function getPageRange(page: number, totalPages: number, siblingCount: number) {
  const totalNumbers = siblingCount * 2 + 5; // 先頭・末尾・現在・両端の省略記号分
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 2);
  const rightSibling = Math.min(page + siblingCount, totalPages - 1);

  const range: (number | "ellipsis")[] = [1];

  if (leftSibling > 2) range.push("ellipsis");
  for (let i = leftSibling; i <= rightSibling; i++) range.push(i);
  if (rightSibling < totalPages - 1) range.push("ellipsis");

  range.push(totalPages);
  return range;
}

/**
 * ApplicationPagination コンポーネント
 *
 * @example
 * ```tsx
 * <ApplicationPagination page={page} totalPages={12} onPageChange={setPage} />
 * ```
 */
export const ApplicationPagination = React.forwardRef<HTMLElement, ApplicationPaginationProps>(
  ({ page, totalPages, onPageChange, siblingCount = 1, className }, ref) => {
    if (totalPages <= 1) return null;

    const items = getPageRange(page, totalPages, siblingCount);

    return (
      <nav
        ref={ref}
        aria-label="ページネーション"
        className={cn("flex items-center justify-center gap-1", className)}
      >
        <button
          type="button"
          aria-label="前のページ"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors",
            "hover:bg-accent hover:text-foreground",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {items.map((item, i) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`${item} ページ目`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                item === page
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          aria-label="次のページ"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors",
            "hover:bg-accent hover:text-foreground",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    );
  },
);

ApplicationPagination.displayName = "ApplicationPagination";
