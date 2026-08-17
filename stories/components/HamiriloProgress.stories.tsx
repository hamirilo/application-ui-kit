import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { HamiriloButton, HamiriloCard, HamiriloProgress } from "../../components/hamirilo";

/**
 * HamiriloProgress は進捗（%）が分かる処理の進行状況を表示する。
 *
 * <important>
 * 完了までの見込みが分からない処理には使わない。`HamiriloSpinner` を使う。
 * </important>
 */
const meta = {
  title: "Components/HamiriloProgress",
  component: HamiriloProgress,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

進捗バーの見た目とラベル・数値表示の組み合わせを統一する。

## 使う場面

- ファイルアップロードの進捗
- 複数ステップの処理（3ステップ中2ステップ完了 等）

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 完了見込みが分からない読み込み中 | \`HamiriloSpinner\` |

## 注意事項

- \`value\` は \`max\`（既定 100）に対する現在値
- \`showValue\` で右側に「50%」のようなパーセント表示を出せる
- \`label\` で「何の進捗か」を伝える（進捗バー単体では意味が伝わらない）
        `,
      },
    },
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    max: { control: "number" },
    showValue: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    value: 40,
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HamiriloProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基本形。 */
export const Default: Story = {};

/** ラベル + 数値表示。 */
export const WithLabelAndValue: Story = {
  args: { label: "アップロード中", showValue: true, value: 68 },
};

/** 最大値を変える（3ステップ中2ステップ完了 等）。 */
export const CustomMax: Story = {
  args: { label: "申請ステップ", value: 2, max: 3, showValue: true },
};

/** 完了状態。 */
export const Complete: Story = {
  args: { label: "完了", value: 100, showValue: true },
};

/**
 * 時間経過で値が変わる例。
 */
export const Animated: Story = {
  render: () => {
    const [value, setValue] = React.useState(0);

    return (
      <div className="space-y-3">
        <HamiriloProgress value={value} label="処理中" showValue />
        <HamiriloButton size="sm" onClick={() => setValue((v) => Math.min(100, v + 20))}>
          進める
        </HamiriloButton>
      </div>
    );
  },
};

/** カード内で使う実際の使い方。 */
export const WithCard: Story = {
  render: () => (
    <HamiriloCard title="ファイルアップロード">
      <HamiriloProgress value={72} label="申請書.pdf" showValue />
    </HamiriloCard>
  ),
};
