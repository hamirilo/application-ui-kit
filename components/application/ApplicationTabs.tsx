/**
 * ApplicationTabs - 共有 UI ライブラリのタブ切り替えコンポーネント
 *
 * 同じ階層にある複数のビューを切り替えるために使う。
 * URL やページ遷移を伴う切り替えにはリンク + ナビゲーションを使い、
 * ApplicationTabs は同一画面内でのビュー切り替えに限定する。
 */

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export interface ApplicationTabItem {
  /** タブの一意な値 */
  value: string;
  /** タブに表示するラベル */
  label: React.ReactNode;
  /** タブに表示するアイコン */
  icon?: React.ReactNode;
  /** タブに対応するパネルの内容 */
  content: React.ReactNode;
  /** 選択不可にする */
  disabled?: boolean;
}

export interface ApplicationTabsProps {
  /** タブ一覧 */
  items: ApplicationTabItem[];

  /** 選択中の値（制御コンポーネントとして使う場合） */
  value?: string;

  /** 初期選択値（非制御の場合） */
  defaultValue?: string;

  /** 選択が変わったときに呼ばれる */
  onValueChange?: (value: string) => void;

  className?: string;
}

/**
 * ApplicationTabs コンポーネント
 *
 * @example
 * ```tsx
 * <ApplicationTabs
 *   items={[
 *     { value: "overview", label: "概要", content: <OverviewPanel /> },
 *     { value: "history", label: "履歴", content: <HistoryPanel /> },
 *   ]}
 *   defaultValue="overview"
 * />
 * ```
 */
export const ApplicationTabs = React.forwardRef<HTMLDivElement, ApplicationTabsProps>(
  ({ items, value, defaultValue, onValueChange, className }, ref) => {
    return (
      <Tabs
        ref={ref}
        value={value}
        defaultValue={defaultValue ?? items[0]?.value}
        onValueChange={onValueChange as (v: unknown) => void}
        className={className}
      >
        <TabsList>
          {items.map((item) => (
            <TabsTrigger key={item.value} value={item.value} disabled={item.disabled}>
              <span className="inline-flex items-center gap-1.5">
                {item.icon}
                {item.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map((item) => (
          <TabsContent key={item.value} value={item.value}>
            {item.content}
          </TabsContent>
        ))}
      </Tabs>
    );
  },
);

ApplicationTabs.displayName = "ApplicationTabs";
