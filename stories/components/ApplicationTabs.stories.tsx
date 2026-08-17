import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Settings, User } from "lucide-react";
import * as React from "react";
import { ApplicationCard, ApplicationTabs } from "../../components/application";

/**
 * ApplicationTabs は同一画面内で複数のビューを切り替えるためのコンポーネント。
 *
 * <important>
 * URL 遷移を伴う切り替え（ページの移動）には使わない。
 * その場合はリンク + ナビゲーション（`sidebar.html` / `global_nav.html`）を使う。
 * </important>
 */
const meta = {
  title: "Components/ApplicationTabs",
  component: ApplicationTabs,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

同一画面内のビュー切り替え（概要 / 履歴 / 設定 等）を統一する。

## 使う場面

- 詳細画面のタブ切り替え（概要・コメント・履歴）
- 設定画面のセクション切り替え

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| URL が変わるページ遷移 | リンク + ナビゲーション |
| 2〜3個の状態を切り替えるだけの絞り込み | ボタン群（\`btn-secondary\` のトグル） |

## Props

タブは JSX の子要素ではなく **\`items\` 配列**で渡す。各項目の \`content\` に
パネルの内容を渡す（選択中のタブだけが DOM に残る）。

## 注意事項

- 矢印キーでタブ間を移動できる（\`Tab\`/\`Enter\`/\`Space\` で確定）
- 無効なタブは初期選択されない
- タブの数は画面幅に収まる程度（5〜6個まで）に留める。増える場合は \`ApplicationSelect\` に切り替える
        `,
      },
    },
  },
  argTypes: {
    items: { table: { disable: true } },
  },
  args: {
    items: [
      {
        value: "overview",
        label: "概要",
        content: <p className="text-sm text-foreground">概要の内容がここに入ります。</p>,
      },
      {
        value: "history",
        label: "履歴",
        content: <p className="text-sm text-foreground">変更履歴の一覧がここに入ります。</p>,
      },
      {
        value: "settings",
        label: "設定",
        content: <p className="text-sm text-foreground">設定項目がここに入ります。</p>,
      },
    ],
  },
} satisfies Meta<typeof ApplicationTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const BASIC_ITEMS = meta.args.items;

/** 基本形。1つ目のタブが初期選択される。 */
export const Default: Story = {
  args: { items: BASIC_ITEMS },
};

/** アイコン付き。 */
export const WithIcons: Story = {
  args: {
    items: [
      {
        value: "profile",
        label: "プロフィール",
        icon: <User className="h-4 w-4" />,
        content: <p className="text-sm text-foreground">プロフィール情報。</p>,
      },
      {
        value: "notifications",
        label: "通知",
        icon: <Bell className="h-4 w-4" />,
        content: <p className="text-sm text-foreground">通知設定。</p>,
      },
      {
        value: "settings",
        label: "設定",
        icon: <Settings className="h-4 w-4" />,
        content: <p className="text-sm text-foreground">アカウント設定。</p>,
      },
    ],
  },
};

/** 一部のタブを無効化した例（権限がない機能等）。 */
export const WithDisabledTab: Story = {
  args: {
    items: [
      {
        value: "overview",
        label: "概要",
        content: <p className="text-sm text-foreground">概要の内容。</p>,
      },
      {
        value: "billing",
        label: "請求（権限なし）",
        disabled: true,
        content: <p className="text-sm text-foreground">閲覧できません。</p>,
      },
      {
        value: "settings",
        label: "設定",
        content: <p className="text-sm text-foreground">設定項目。</p>,
      },
    ],
  },
};

/**
 * 制御コンポーネントとして使う場合。
 *
 * 選択中のタブに応じて別の要素（見出し等）を出し分けたいときに使う。
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("overview");
    return (
      <div className="space-y-3">
        <ApplicationTabs items={BASIC_ITEMS} value={value} onValueChange={setValue} />
        <p className="text-sm text-muted-foreground">
          選択中のタブ: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{value}</code>
        </p>
      </div>
    );
  },
};

/** ApplicationCard の中で使う実際の使い方。 */
export const WithCard: Story = {
  render: () => (
    <ApplicationCard title="申請 #1024">
      <ApplicationTabs items={BASIC_ITEMS} />
    </ApplicationCard>
  ),
};
