/**
 * HamiriloTabs - shared UI libraryのタブ切り替えコンポーネント
 *
 * 同じ階層にある複数のビューを切り替えるために使う。
 * URL やページ遷移を伴う切り替えにはリンク + ナビゲーションを使い、
 * HamiriloTabs は同一画面内でのビュー切り替えに限定する。
 */

import * as React from "react";
import { Tabs, TabsList, TabsPanel, TabsTab } from "../ui/tabs";

export interface HamiriloTabItem {
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

export interface HamiriloTabsProps {
  /** タブ一覧 */
  items: HamiriloTabItem[];

  /** 選択中の値（制御コンポーネントとして使う場合） */
  value?: string;

  /** 初期選択値（非制御の場合） */
  defaultValue?: string;

  /** 選択が変わったときに呼ばれる */
  onValueChange?: (value: string) => void;

  className?: string;
}

/**
 * HamiriloTabs コンポーネント
 *
 * @example
 * ```tsx
 * <HamiriloTabs
 *   items={[
 *     { value: "overview", label: "概要", content: <OverviewPanel /> },
 *     { value: "history", label: "履歴", content: <HistoryPanel /> },
 *   ]}
 *   defaultValue="overview"
 * />
 * ```
 */
export const HamiriloTabs = React.forwardRef<HTMLDivElement, HamiriloTabsProps>(
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
            <TabsTab key={item.value} value={item.value} disabled={item.disabled}>
              <span className="inline-flex items-center gap-1.5">
                {item.icon}
                {item.label}
              </span>
            </TabsTab>
          ))}
        </TabsList>
        {items.map((item) => (
          <TabsPanel key={item.value} value={item.value}>
            {item.content}
          </TabsPanel>
        ))}
      </Tabs>
    );
  },
);

HamiriloTabs.displayName = "HamiriloTabs";
