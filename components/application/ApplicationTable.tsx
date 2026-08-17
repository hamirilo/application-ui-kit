/**
 * ApplicationTable - shared UI libraryのテーブルコンポーネント
 *
 * 列定義（columns）とデータ（rows）を渡すと、ヘッダー・行・空状態を
 * 一貫した見た目で描画する。空状態の文言を必ず指定させることで
 * 「データが無いときに何も出ない画面」を防ぐ。
 *
 * <important>
 * これは「見た目の共通化」だけを担う。ソート・ページング・フィルタは
 * 業務ロジックなので各アプリ側で実装し、その結果を rows に渡す。
 * application 側の一覧は application rendering + テンプレートで描画し、ApplicationTable は使わない。
 * </important>
 */

import type * as React from "react";
import { cn } from "../../lib/utils";

export interface ApplicationTableColumn<T> {
  /** 列のキー（React の key に使う） */
  key: string;

  /** ヘッダーに表示する内容 */
  header: React.ReactNode;

  /** セルの内容を返す */
  cell: (row: T, rowIndex: number) => React.ReactNode;

  /**
   * 列の寄せ。数値・金額は right、操作ボタンは right が読みやすい。
   * @default "left"
   */
  align?: "left" | "center" | "right";

  /** 列幅（Tailwind クラス。例: "w-32"） */
  className?: string;

  /** ヘッダーセルにだけ付けるクラス */
  headerClassName?: string;
}

export interface ApplicationTableProps<T> {
  /** 列定義 */
  columns: ApplicationTableColumn<T>[];

  /** 表示するデータ */
  rows: T[];

  /** 各行の React key を返す。省略すると index を使う（並び替えがある場合は必ず指定） */
  rowKey?: (row: T, index: number) => string | number;

  /**
   * データが 0 件のときに表示する文言。
   * 「なぜ空なのか」「次に何をすればよいか」が分かる文にする。
   * @default "データがありません"
   */
  emptyMessage?: React.ReactNode;

  /** 空状態の補足説明 */
  emptySubMessage?: React.ReactNode;

  /** 行クリック時の処理。渡すと行にホバー・カーソルが付く */
  onRowClick?: (row: T, index: number) => void;

  /** テーブルの用途を支援技術に伝える説明（視覚的には非表示） */
  caption?: string;

  className?: string;
}

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

/**
 * ApplicationTable コンポーネント
 *
 * @example
 * ```tsx
 * type Row = { id: number; name: string; amount: number }
 *
 * <ApplicationTable<Row>
 *   columns={[
 *     { key: "name", header: "名前", cell: (r) => r.name },
 *     { key: "amount", header: "金額", align: "right",
 *       cell: (r) => `${r.amount.toLocaleString()} 円` },
 *   ]}
 *   rows={rows}
 *   rowKey={(r) => r.id}
 *   emptyMessage="申請がありません"
 *   emptySubMessage="「新規申請」から作成してください"
 * />
 * ```
 */
export function ApplicationTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "データがありません",
  emptySubMessage,
  onRowClick,
  caption,
  className,
}: ApplicationTableProps<T>) {
  const isEmpty = rows.length === 0;

  return (
    <div
      className={cn("w-full overflow-x-auto rounded-xl border border-border bg-card", className)}
    >
      <table className="w-full border-collapse text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}

        <thead>
          <tr className="border-b border-border bg-muted">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-4 py-2.5 text-xs font-semibold text-muted-foreground",
                  ALIGN_CLASS[col.align ?? "left"],
                  col.className,
                  col.headerClassName,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isEmpty ? (
            <tr>
              {/* 空状態は design-system/components.md の empty_state と同じ構成 */}
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
                {emptySubMessage && (
                  <p className="mt-1 text-xs text-muted-foreground">{emptySubMessage}</p>
                )}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={rowKey ? rowKey(row, i) : i}
                onClick={onRowClick ? () => onRowClick(row, i) : undefined}
                className={cn(
                  "border-b border-border last:border-0",
                  onRowClick &&
                    "cursor-pointer transition-colors hover:bg-accent focus-within:bg-accent",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 text-foreground",
                      ALIGN_CLASS[col.align ?? "left"],
                      col.className,
                    )}
                  >
                    {col.cell(row, i)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

ApplicationTable.displayName = "ApplicationTable";
