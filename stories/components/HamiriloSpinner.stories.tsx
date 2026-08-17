import type { Meta, StoryObj } from "@storybook/react-vite";
import { HamiriloButton, HamiriloCard, HamiriloSpinner } from "../../components/hamirilo";

/**
 * HamiriloSpinner はページ・カード・セクション単位の読み込み中表示。
 *
 * <important>
 * ボタン内のローディングには使わない。`HamiriloButton` の `loading` prop を使う。
 * </important>
 */
const meta = {
  title: "Components/HamiriloSpinner",
  component: HamiriloSpinner,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

読み込み中であることを示すインジケーターを統一する。

## 使う場面

- カード・セクション単位のデータ取得中
- ページ全体の初期読み込み

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| ボタンのローディング | \`HamiriloButton\` の \`loading\` prop |
| 進捗（%）が分かる処理 | \`HamiriloProgress\` |

## 注意事項

- \`role="status"\` と \`sr-only\` のラベルを持つため、支援技術には「読み込み中」であることが伝わる
- \`label\` で文脈（「申請一覧を読み込み中」等）を伝えられる
        `,
      },
    },
  },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    label: { control: "text" },
  },
} satisfies Meta<typeof HamiriloSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基本形。 */
export const Default: Story = {};

/** 全サイズの一覧。 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <HamiriloSpinner size="xs" />
      <HamiriloSpinner size="sm" />
      <HamiriloSpinner size="md" />
      <HamiriloSpinner size="lg" />
    </div>
  ),
};

/** カード内の読み込み中として使う実際の使い方。 */
export const WithCard: Story = {
  render: () => (
    <HamiriloCard title="申請一覧">
      <div className="flex justify-center py-8">
        <HamiriloSpinner label="申請一覧を読み込み中" />
      </div>
    </HamiriloCard>
  ),
};

/** ボタンのローディングは別コンポーネント（`HamiriloButton` の `loading`）を使う比較例。 */
export const NotForButtons: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <HamiriloButton loading>送信中...</HamiriloButton>
      <span className="text-sm text-muted-foreground">
        ← ボタン内は HamiriloSpinner ではなくこちらを使う
      </span>
    </div>
  ),
};
