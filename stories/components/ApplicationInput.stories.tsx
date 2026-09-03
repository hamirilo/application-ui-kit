import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search, X } from "lucide-react";
import { ApplicationFormField, ApplicationInput } from "../../components/application";
import { Labeled, Section, Showcase, Stack } from "../_showcase";

/**
 * ApplicationInput はテキスト入力の唯一のコンポーネント。
 *
 * <important>
 * これは **React コンポーネントの中でだけ** 使う。
 * application フォームでは widget に `class="input-field"` を指定する。
 * 見本は Foundations を参照。
 * </important>
 */
const meta = {
  title: "コンポーネント/ApplicationInput",
  component: ApplicationInput,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

入力欄の見た目・フォーカスリング・エラー表現を 1 箇所に集約する。
application の \`input-field\` クラスと同じ余白（\`px-3.5 py-2.5\`）・角丸（\`rounded-lg\`）に
揃えてあるため、同じ画面にサーバーレンダリングのフォームと React コンポーネントが並んでも段差が出ない。

## 使う場面

- React コンポーネント内のテキスト・メール・数値・パスワード入力
- 検索ボックス（\`leftIcon\` に検索アイコン）

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| テンプレート（.html）の入力欄 | widget に \`class="input-field"\` を指定 |
| ラベル・エラー・ヘルプも必要 | \`ApplicationFormField\` で包む（余白と aria が自動で付く） |
| 複数行の入力 | \`<textarea className="input-field">\`（React 版は未提供） |
| 選択肢から選ぶ | \`ApplicationSelect\` |
| 日付の入力 | \`ApplicationDatePicker\` |
| 検索して選ぶ（社員選択など） | \`ApplicationCombobox\`（React） / ネイティブの \`<select>\`（テンプレート） |

## 注意事項

- **\`error\` は色だけを変える。** 色覚特性のある利用者には伝わらないため、
  必ずエラーメッセージも表示する。\`ApplicationFormField\` を使えば両方自動で付く
- \`aria-invalid\` は \`error\` から自動で付く。手で書く必要はない
- **\`placeholder\` はラベルの代わりにならない**（入力すると消える）。
  \`ApplicationFormField\` で囲むか、囲まない場合は \`aria-label\` を渡す
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
} satisfies Meta<typeof ApplicationInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 状態とアイコンの有無を 1 画面で比較する。
 *
 * ラベルは通常 `ApplicationFormField` が持つ。ここでは状態の見た目を比べるため
 * ラベルを外し、支援技術向けに `aria-label` を付けている。
 */
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Showcase>
      <Section
        title="States"
        note="error は枠線だけを変える。何が悪いのかは ApplicationFormField の error に文章で書く。"
      >
        <Stack>
          <Labeled label="通常">
            <ApplicationInput placeholder="例: 備品購入の申請" aria-label="通常" />
          </Labeled>
          <Labeled label="入力済み">
            <ApplicationInput defaultValue="備品購入の申請" aria-label="入力済み" />
          </Labeled>
          <Labeled label="エラー">
            <ApplicationInput error defaultValue="" aria-label="エラー" />
          </Labeled>
          <Labeled label="無効（操作できない）">
            <ApplicationInput disabled defaultValue="申請番号は自動採番" aria-label="無効" />
          </Labeled>
          <Labeled label="読み取り専用（値は選択・コピーできる）">
            <ApplicationInput readOnly defaultValue="SYS-2026-0001" aria-label="読み取り専用" />
          </Labeled>
        </Stack>
      </Section>

      <Section title="With Icon" note="左は入力の種類、右は操作（クリア等）に使う。">
        <Stack>
          <Labeled label="leftIcon">
            <ApplicationInput
              leftIcon={<Search />}
              placeholder="検索"
              aria-label="検索"
            />
          </Labeled>
          <Labeled label="rightIcon">
            <ApplicationInput
              rightIcon={
                <button
                  type="button"
                  aria-label="クリア"
                  className="text-muted-foreground hover:text-foreground [--icon-box:1rem]"
                >
                  <X className="size-4" />
                </button>
              }
              defaultValue="入力をクリアできる"
              aria-label="クリア付き"
            />
          </Labeled>
        </Stack>
      </Section>

      <Section
        title="With Label"
        note="実装ではこの形が基本。ラベル・必須・エラーは ApplicationFormField が持つ。"
      >
        <Stack>
          <ApplicationFormField label="件名" required helpText="50 文字以内">
            <ApplicationInput placeholder="例: 備品購入の申請" />
          </ApplicationFormField>
          <ApplicationFormField label="件名" required error="件名は必須です">
            <ApplicationInput error defaultValue="" />
          </ApplicationFormField>
        </Stack>
      </Section>
    </Showcase>
  ),
};

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
    leftIcon: <Search />,
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
    leftIcon: <Search />,
    rightIcon: (
      <button
        type="button"
        aria-label="検索条件をクリア"
        className="text-muted-foreground hover:text-foreground [--icon-box:1rem]"
      >
        <X className="size-4" />
      </button>
    ),
  },
};

/**
 * `ApplicationFormField` と組み合わせた実際の使い方。
 *
 * `ApplicationFormField` に `error` を渡すと、内側の `ApplicationInput` にも自動で
 * `error` / `aria-invalid` / `aria-describedby` が注入される。
 * **フォームを組むときは常にこの形にする。**
 */
export const WithFormField: Story = {
  render: () => (
    <div className="space-y-4">
      <ApplicationFormField label="件名" required helpText="50 文字以内で入力してください">
        <ApplicationInput placeholder="例: 備品購入の申請" />
      </ApplicationFormField>

      <ApplicationFormField
        label="メールアドレス"
        required
        error="メールアドレスの形式が正しくありません"
      >
        <ApplicationInput defaultValue="foo@" />
      </ApplicationFormField>

      <ApplicationFormField label="管理番号" helpText="システムが自動で採番します">
        <ApplicationInput readOnly defaultValue="SYS-2026-0001" />
      </ApplicationFormField>
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
      <ApplicationFormField label="メールアドレス">
        <ApplicationInput type="email" placeholder="user@example.com" />
      </ApplicationFormField>

      <ApplicationFormField label="パスワード">
        <ApplicationInput type="password" placeholder="••••••••" />
      </ApplicationFormField>

      <ApplicationFormField label="金額" helpText="半角数字で入力してください">
        <ApplicationInput type="number" placeholder="0" min={0} step={1} />
      </ApplicationFormField>

      <ApplicationFormField
        label="電話番号"
        helpText="type=number ではなく text + inputMode=numeric を使う（スピナーの誤操作と IME の問題を避けるため）"
      >
        <ApplicationInput type="text" inputMode="numeric" placeholder="03-1234-5678" />
      </ApplicationFormField>
    </div>
  ),
};


