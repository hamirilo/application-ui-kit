import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutGrid, List, Rows3 } from "lucide-react";
import * as React from "react";
import {
  HamiriloButtonGroup,
  type HamiriloButtonGroupItem,
  HamiriloFormField,
} from "../../components/hamirilo";

const PERIODS: HamiriloButtonGroupItem[] = [
  { value: "day", label: "日" },
  { value: "week", label: "週" },
  { value: "month", label: "月" },
];

/**
 * HamiriloButtonGroup は排他的な選択（どれか1つ）を、隣接したボタンの並び
 * （segmented control）として表現するコンポーネント。
 *
 * <important>
 * 内部的には `HamiriloRadioGroup` と同じくラジオボタン。「複数選べる」ようには見えるが
 * 実際には 1 つしか選べないため、複数選択が必要な場面では使わない。
 * </important>
 */
const meta = {
  title: "Components/HamiriloButtonGroup",
  component: HamiriloButtonGroup,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

排他的な選択を、常に全選択肢が見えるボタンの並びとして提供する。
見た目のボタングループだが、選択の意味は \`HamiriloRadioGroup\` と同じ（どれか1つ）。

## 使う場面

- 選択肢が **2〜5個** で、選んだ結果を常に見せておきたい表示切替（一覧 / グリッド、日 / 週 / 月）
- 各選択肢を短いラベルやアイコンだけで表せる場合

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 選択肢が多い（6個以上） | \`HamiriloSelect\`（省スペース） |
| 複数選択したい | \`HamiriloCheckbox\` のリスト |
| 補足説明を選択肢ごとに添えたい | \`HamiriloRadioGroup\`（縦に並ぶ分、説明文を置ける） |
| ページ内のコンテンツ切り替え（タブ） | \`HamiriloTabs\` |

## Props

選択肢は JSX の子要素ではなく **\`items\` 配列**で渡す（\`HamiriloSelect\` と同じ方針）。
\`variant\`（\`primary\` / \`secondary\`）と \`size\`（\`sm\` / \`md\` / \`lg\`）でカスタマイズできる。

## 注意事項

- 視覚的なラベルが画面上にない場合は **\`aria-label\` が必須**（何を選ぶボタン列か伝わらない）
- \`HamiriloFormField\` で囲むとラベルとエラー表示が自動で付く
- \`name\` を渡すとフォーム送信に含められる
        `,
      },
    },
  },
  argTypes: {
    items: { table: { disable: true } },
    variant: { control: "radio", options: ["primary", "secondary"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  args: {
    items: PERIODS,
    "aria-label": "表示期間",
  },
} satisfies Meta<typeof HamiriloButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基本形。 */
export const Default: Story = {
  args: { defaultValue: "week" },
};

/** アイコン付き選択肢。 */
export const WithIcons: Story = {
  args: {
    items: [
      { value: "list", label: "リスト", icon: <List /> },
      { value: "rows", label: "行表示", icon: <Rows3 /> },
      { value: "grid", label: "グリッド", icon: <LayoutGrid /> },
    ],
    defaultValue: "list",
    "aria-label": "表示形式",
  },
};

/** secondary バリアント。選択中を控えめな塗りで示す。 */
export const Secondary: Story = {
  args: { variant: "secondary", defaultValue: "week" },
};

/** サイズの一覧。 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <HamiriloButtonGroup {...args} size="sm" defaultValue="week" />
      <HamiriloButtonGroup {...args} size="md" defaultValue="week" />
      <HamiriloButtonGroup {...args} size="lg" defaultValue="week" />
    </div>
  ),
};

/** 一部の選択肢を無効化した例（権限で選べない場合等）。 */
export const WithDisabledItem: Story = {
  args: {
    items: [
      { value: "draft", label: "下書き" },
      { value: "published", label: "公開" },
      { value: "archived", label: "アーカイブ（権限なし）", disabled: true },
    ],
    defaultValue: "draft",
    "aria-label": "公開状態",
  },
};

/** 操作不可（グループ全体）。 */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "week" },
};

/**
 * 制御コンポーネントとして使う場合。
 */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("week");
    return (
      <div className="space-y-3">
        <HamiriloButtonGroup {...args} value={value} onValueChange={setValue} />
        <p className="text-sm text-muted-foreground">
          選択中の値: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{value}</code>
        </p>
      </div>
    );
  },
};

/**
 * `HamiriloFormField` と組み合わせた実際の使い方。
 */
export const WithFormField: Story = {
  render: () => (
    <HamiriloFormField label="表示期間" required helpText="後から変更できます">
      <HamiriloButtonGroup items={PERIODS} name="period" defaultValue="week" />
    </HamiriloFormField>
  ),
};
