import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApplicationButton, ApplicationCard, ApplicationSpinner } from "../../components/application";

/**
 * ApplicationSpinner はページ・カード・セクション単位の読み込み中表示。
 *
 * <important>
 * ボタン内のローディングには使わない。`ApplicationButton` の `loading` prop を使う。
 * </important>
 */
const meta = {
  title: "Components/ApplicationSpinner",
  component: ApplicationSpinner,
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
| ボタンのローディング | \`ApplicationButton\` の \`loading\` prop |
| 進捗（%）が分かる処理 | \`ApplicationProgress\` |

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
} satisfies Meta<typeof ApplicationSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基本形。 */
export const Default: Story = {};

/** 全サイズの一覧。 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ApplicationSpinner size="xs" />
      <ApplicationSpinner size="sm" />
      <ApplicationSpinner size="md" />
      <ApplicationSpinner size="lg" />
    </div>
  ),
};

/** カード内の読み込み中として使う実際の使い方。 */
export const WithCard: Story = {
  render: () => (
    <ApplicationCard title="申請一覧">
      <div className="flex justify-center py-8">
        <ApplicationSpinner label="申請一覧を読み込み中" />
      </div>
    </ApplicationCard>
  ),
};

/** ボタンのローディングは別コンポーネント（`ApplicationButton` の `loading`）を使う比較例。 */
export const NotForButtons: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ApplicationButton loading>送信中...</ApplicationButton>
      <span className="text-sm text-muted-foreground">
        ← ボタン内は ApplicationSpinner ではなくこちらを使う
      </span>
    </div>
  ),
};
