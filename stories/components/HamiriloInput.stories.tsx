import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search, X } from "lucide-react";
import { HamiriloFormField, HamiriloInput } from "../../components/hamirilo";

/**
 * HamiriloInput はテキスト入力の唯一のコンポーネント。
 *
 * <important>
 * これは **React application の中でだけ** 使う。
 * server-rendered application フォームでは widget に `class="input-field"` を指定する。
 * 見本は Foundations/CSS Classes を参照。
 * </important>
 */
const meta = {
  title: "Components/HamiriloInput",
  component: HamiriloInput,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

入力欄の見た目・フォーカスリング・エラー表現を 1 箇所に集約する。
server-rendered application の \`input-field\` クラスと同じ余白（\`px-3.5 py-2.5\`）・角丸（\`rounded-lg\`）に
揃えてあるため、同じ画面に server-rendering フォームと React application が並んでも段差が出ない。

## 使う場面

- React application 内のテキスト・メール・数値・パスワード入力
- 検索ボックス（\`leftIcon\` に検索アイコン）

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| server-rendered markup（.html）の入力欄 | widget に \`class="input-field"\` を指定 |
| ラベル・エラー・ヘルプも必要 | \`HamiriloFormField\` で包む（余白と aria が自動で付く） |
| 複数行の入力 | \`<textarea className="input-field">\`（React 版は未提供） |
| 選択肢から選ぶ | \`HamiriloSelect\` |
| 日付の入力 | \`HamiriloDatePicker\` |
| 検索して選ぶ（社員選択など） | Tom Select（server-rendered application） / Autocomplete（React） |

## 注意事項

- **\`error\` は色だけを変える。** 色覚特性のある利用者には伝わらないため、
  必ずエラーメッセージも表示する。\`HamiriloFormField\` を使えば両方自動で付く
- \`aria-invalid\` は \`error\` から自動で付く。手で書く必要はない
- **\`placeholder\` はラベルの代わりにならない**（入力すると消える）。
  \`HamiriloFormField\` で囲むか、囲まない場合は \`aria-label\` を渡す
- **\`type="number"\` は慎重に。** スピナーの誤操作や IME との相性問題があるため、
  電話番号・郵便番号・社員番号には \`type="text"\` + \`inputMode="numeric"\` を使う
- \`leftIcon\` / \`rightIcon\` を渡すと \`relative\` の wrapper が付く。
  渡さない場合は wrapper なしの素の \`<input>\` になる（レイアウトに影響しない）
- アイコンは装飾なので \`leftIcon\` は \`aria-hidden\` 扱いになる。
  意味のある操作（クリアボタン等）は \`rightIcon\` に \`aria-label\` 付きで渡す
        `,
      },
    },
  },
  argTypes: {
    error: { control: "boolean", description: "エラー状態（枠線が danger 色になる）" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel", "url"],
    },
    leftIcon: { table: { disable: true } },
    rightIcon: { table: { disable: true } },
  },
  args: {
    placeholder: "件名を入力",
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HamiriloInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基本形。`input-field` クラスと同じ見た目。 */
export const Default: Story = {};

/** 初期値あり。 */
export const WithValue: Story = {
  args: { defaultValue: "備品購入の申請" },
};

/**
 * エラー状態。
 *
 * **枠線の色だけでは何が悪いか分からない。** 実際の画面では必ずメッセージを添える
 * （`WithFormField` を参照）。
 */
export const Error: Story = {
  args: { error: true, defaultValue: "foo@" },
};

/** 操作不可。`disabled` は背景が `bg-muted` になり、カーソルも変わる。 */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "編集できません" },
};

/** 読み取り専用。`disabled` と違いフォーカスでき、値をコピーできる。 */
export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "SYS-2026-0001" },
};

/** 検索ボックス。アイコンは装飾なので支援技術には読まれない。 */
export const WithLeftIcon: Story = {
  args: {
    placeholder: "検索",
    leftIcon: <Search className="w-4 h-4" />,
  },
};

/**
 * 右側にクリアボタン。
 *
 * `rightIcon` は操作要素も置けるため、`aria-label` を必ず付ける。
 */
export const WithRightIcon: Story = {
  args: {
    defaultValue: "検索キーワード",
    leftIcon: <Search className="w-4 h-4" />,
    rightIcon: (
      <button
        type="button"
        aria-label="検索条件をクリア"
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
    ),
  },
};

/**
 * `HamiriloFormField` と組み合わせた実際の使い方。
 *
 * `HamiriloFormField` に `error` を渡すと、内側の `HamiriloInput` にも自動で
 * `error` / `aria-invalid` / `aria-describedby` が注入される。
 * **フォームを組むときは常にこの形にする。**
 */
export const WithFormField: Story = {
  render: () => (
    <div className="space-y-4">
      <HamiriloFormField label="件名" required helpText="50 文字以内で入力してください">
        <HamiriloInput placeholder="例: 備品購入の申請" />
      </HamiriloFormField>

      <HamiriloFormField
        label="メールアドレス"
        required
        error="メールアドレスの形式が正しくありません"
      >
        <HamiriloInput defaultValue="foo@" />
      </HamiriloFormField>

      <HamiriloFormField label="管理番号" helpText="システムが自動で採番します">
        <HamiriloInput readOnly defaultValue="SYS-2026-0001" />
      </HamiriloFormField>
    </div>
  ),
};

/**
 * 入力の種類ごとの例。
 *
 * 電話番号に `type="number"` を使わない理由に注意。
 */
export const InputTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <HamiriloFormField label="メールアドレス">
        <HamiriloInput type="email" placeholder="user@example.com" />
      </HamiriloFormField>

      <HamiriloFormField label="パスワード">
        <HamiriloInput type="password" placeholder="••••••••" />
      </HamiriloFormField>

      <HamiriloFormField label="金額" helpText="半角数字で入力してください">
        <HamiriloInput type="number" placeholder="0" min={0} step={1} />
      </HamiriloFormField>

      <HamiriloFormField
        label="電話番号"
        helpText="type=number ではなく text + inputMode=numeric を使う（スピナーの誤操作と IME の問題を避けるため）"
      >
        <HamiriloInput type="text" inputMode="numeric" placeholder="03-1234-5678" />
      </HamiriloFormField>
    </div>
  ),
};

/** 全状態の一覧。ツールバーの Theme を dark にしても崩れない。 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-3">
      {/* placeholder はラベルの代わりにならない（入力すると消える）ため
          ラベルなしで置く場合は aria-label を付ける */}
      <HamiriloInput placeholder="通常" aria-label="通常" />
      <HamiriloInput defaultValue="入力済み" aria-label="入力済み" />
      <HamiriloInput error defaultValue="エラー" aria-label="エラー" />
      <HamiriloInput disabled defaultValue="無効" aria-label="無効" />
      <HamiriloInput readOnly defaultValue="読み取り専用" aria-label="読み取り専用" />
      <HamiriloInput
        leftIcon={<Search className="w-4 h-4" />}
        placeholder="アイコン付き"
        aria-label="アイコン付き"
      />
    </div>
  ),
};
