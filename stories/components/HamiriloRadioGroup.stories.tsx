import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  HamiriloFormField,
  HamiriloRadioGroup,
  type HamiriloRadioGroupItem,
} from "../../components/hamirilo";

const PRIORITIES: HamiriloRadioGroupItem[] = [
  { value: "high", label: "高" },
  { value: "mid", label: "中" },
  { value: "low", label: "低" },
];

/**
 * HamiriloRadioGroup は排他的な選択（どれか1つ）を表すコンポーネント。
 *
 * <important>
 * チェックボックスと違い「複数選べる」と読まれない。選択肢が相互排他のときは
 * 必ずこちらを使う。
 * </important>
 */
const meta = {
  title: "Components/HamiriloRadioGroup",
  component: HamiriloRadioGroup,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

排他的な選択（どれか1つ）をチェックボックスと区別して提供する。

## 使う場面

- 選択肢が **2〜5個** で、常に画面に見せておきたい場合（優先度・区分）
- 「その他」など補足入力が伴う選択

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 選択肢が 2 つで、片方が既定の ON/OFF | \`HamiriloCheckbox\`（1 クリックで済む） |
| 選択肢が多い（6個以上） | \`HamiriloSelect\`（省スペース） |
| 複数選択したい | \`HamiriloCheckbox\` のリスト |
| ボタンの並びとして見せたい（表示切替・期間選択など） | \`HamiriloButtonGroup\` |

## Props

選択肢は JSX の子要素ではなく **\`items\` 配列**で渡す（\`HamiriloSelect\` と同じ方針）。

## 注意事項

- \`orientation="horizontal"\` は選択肢が短い文言のときのみ使う（折り返すと読みにくい）
- \`HamiriloFormField\` で囲むとラベルとエラー表示が自動で付く
- グループ全体の \`name\` を渡すとフォーム送信に含められる
        `,
      },
    },
  },
  argTypes: {
    items: { table: { disable: true } },
    orientation: { control: "radio", options: ["vertical", "horizontal"] },
    disabled: { control: "boolean" },
  },
  args: {
    items: PRIORITIES,
  },
} satisfies Meta<typeof HamiriloRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基本形（縦並び）。 */
export const Default: Story = {
  args: { defaultValue: "mid" },
};

/** 横並び。選択肢の文言が短いときに使う。 */
export const Horizontal: Story = {
  args: { orientation: "horizontal", defaultValue: "mid" },
};

/** 補足説明付き。 */
export const WithDescription: Story = {
  args: {
    items: [
      { value: "public", label: "公開", description: "誰でも閲覧できます" },
      { value: "internal", label: "shared限定", description: "sharedメンバーのみ閲覧できます" },
      { value: "private", label: "非公開", description: "自分のみ閲覧できます" },
    ],
    defaultValue: "internal",
  },
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
  },
};

/** 操作不可（グループ全体）。 */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "mid" },
};

/**
 * 制御コンポーネントとして使う場合。
 */
export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("mid");
    return (
      <div className="space-y-3">
        <HamiriloRadioGroup {...args} value={value} onValueChange={setValue} />
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
    <HamiriloFormField label="優先度" required helpText="後から変更できます">
      <HamiriloRadioGroup items={PRIORITIES} name="priority" defaultValue="mid" />
    </HamiriloFormField>
  ),
};
