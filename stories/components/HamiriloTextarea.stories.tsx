import type { Meta, StoryObj } from "@storybook/react-vite";
import { HamiriloFormField, HamiriloTextarea } from "../../components/hamirilo";

/**
 * HamiriloTextarea は複数行テキスト入力の唯一のコンポーネント。
 *
 * <important>
 * これは **React application の中でだけ** 使う。
 * application フォームでは widget に `class="input-field"` を指定する。
 * </important>
 */
const meta = {
  title: "Components/HamiriloTextarea",
  component: HamiriloTextarea,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

複数行入力の見た目・フォーカスリング・エラー表現を \`HamiriloInput\` と揃えて提供する。

## 使う場面

- コメント・詳細説明・自由記述欄

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 1 行の入力 | \`HamiriloInput\` |
| markup（.html）の入力欄 | widget に \`class="input-field"\` を指定 |

## 注意事項

- **\`error\` は色だけを変える。** 必ずエラーメッセージも表示する。\`HamiriloFormField\` を使えば両方自動で付く
- 既定の \`rows\` は 4。文章量に応じて調整する
- \`resize="none"\` でユーザーによるリサイズを禁止できる（レイアウトを固定したい場合）
        `,
      },
    },
  },
  argTypes: {
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    resize: { control: "radio", options: ["none", "vertical"] },
    placeholder: { control: "text" },
  },
  args: {
    placeholder: "詳細を入力してください",
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HamiriloTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基本形。 */
export const Default: Story = {};

/** 初期値あり。 */
export const WithValue: Story = {
  args: { defaultValue: "備品購入の理由を記載しています。" },
};

/** エラー状態。実際の画面では必ずメッセージを添える（`WithFormField` を参照）。 */
export const Error: Story = {
  args: { error: true, defaultValue: "" },
};

/** 操作不可。 */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "編集できません" },
};

/** リサイズ禁止。カード内など高さを固定したい場所で使う。 */
export const NoResize: Story = {
  args: { resize: "none", rows: 3 },
};

/**
 * `HamiriloFormField` と組み合わせた実際の使い方。
 */
export const WithFormField: Story = {
  render: () => (
    <div className="space-y-4">
      <HamiriloFormField label="申請理由" required helpText="200文字以内で入力してください">
        <HamiriloTextarea placeholder="例: 老朽化した椅子の買い替えのため" />
      </HamiriloFormField>

      <HamiriloFormField label="差戻し理由" required error="差戻し理由を入力してください">
        <HamiriloTextarea />
      </HamiriloFormField>
    </div>
  ),
};
