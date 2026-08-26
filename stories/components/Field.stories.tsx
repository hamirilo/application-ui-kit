import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ApplicationCheckbox,
  ApplicationInput,
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  Textarea,
} from "../../components/application";
import { Section, Showcase } from "../_showcase";

/**
 * Field は入力欄・ラベル・説明・エラーの並びを組み立てる下地。
 * 素の shadcn/ui をそのまま公開している。
 *
 * <important>
 * 単一項目に必要なのは大抵 \`ApplicationFormField\` のほう。こちらは
 * \`FieldSet\` でまとまりを作る、\`orientation="horizontal"\` にする、
 * チェックボックスを行に並べる、といった Field でしかできない組み方のときに使う。
 * </important>
 */
const meta = {
  title: "Forms/Field",
  component: Field,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

ラベル・入力欄・説明・エラーの並びと余白を組み立てる。ラップしても足せる value が
ないため、素の shadcn/ui を re-export している。API は
[shadcn/ui の Field](https://ui.shadcn.com/docs/components/field) と同じ。

## 構成

| 部品 | 役割 |
|---|---|
| \`FieldSet\` / \`FieldLegend\` | 複数項目のまとまりと、その見出し |
| \`FieldGroup\` | 項目を縦に積むコンテナ |
| \`Field\` | 1 項目。\`orientation\` で縦・横・レスポンシブを選ぶ |
| \`FieldLabel\` / \`FieldTitle\` | 項目名 |
| \`FieldContent\` | ラベルの右（または下）の中身 |
| \`FieldDescription\` | ヘルプテキスト |
| \`FieldError\` | エラー。\`errors\` 配列も受け取れる |
| \`FieldSeparator\` | まとまりの区切り |

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| ラベル + ヘルプ + エラーの単一項目 | \`ApplicationFormField\`（余白関係が固定されていて速い） |
| ラベルだけ | \`Label\` |

## 注意事項

- \`orientation="horizontal"\` はチェックボックス・ラジオと相性が良い
- エラーは \`aria-invalid\` と併せて出す。\`FieldError\` だけ出しても支援技術には伝わらない
- 必須は \`*\` に加えてスクリーンリーダー専用の「（必須）」を添える
        `,
      },
    },
    controls: { disable: true },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 向き・説明・エラー・まとまりを 1 画面で比較する。 */
export const Overview: Story = {
  render: () => (
    <Showcase>
      <Section title="Vertical" note="既定。ラベルが上、入力欄が下。">
        <FieldGroup className="max-w-md">
          <Field>
            <FieldLabel htmlFor="ov-f-title">件名</FieldLabel>
            <ApplicationInput id="ov-f-title" placeholder="備品購入" />
            <FieldDescription>一覧に表示される名前です。</FieldDescription>
          </Field>
        </FieldGroup>
      </Section>

      <Section
        title="Horizontal"
        note="チェックボックス・ラジオと相性が良い。ラベルが操作の右に来る。"
      >
        <FieldGroup className="max-w-md">
          <Field orientation="horizontal">
            <ApplicationCheckbox id="ov-f-agree" />
            <FieldLabel htmlFor="ov-f-agree">社内規程を確認しました</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <ApplicationCheckbox id="ov-f-urgent" />
            <FieldLabel htmlFor="ov-f-urgent">至急で処理する</FieldLabel>
          </Field>
        </FieldGroup>
      </Section>

      <Section title="Error" note="aria-invalid と FieldError を必ず併せる。">
        <FieldGroup className="max-w-md">
          <Field>
            <FieldLabel htmlFor="ov-f-amount">
              金額
              <span aria-hidden="true" className="text-danger">
                *
              </span>
              <span className="sr-only">（必須）</span>
            </FieldLabel>
            <ApplicationInput id="ov-f-amount" aria-invalid defaultValue="150000" />
            <FieldError>上限額（100,000 円）を超えています</FieldError>
          </Field>
        </FieldGroup>
      </Section>

      <Section title="FieldSet" note="複数項目のまとまりには legend で見出しを付ける。">
        <FieldSet className="max-w-md">
          <FieldLegend>申請内容</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ov-f-item">品目</FieldLabel>
              <ApplicationInput id="ov-f-item" placeholder="モニター" />
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel htmlFor="ov-f-note">備考</FieldLabel>
              <Textarea id="ov-f-note" placeholder="補足があれば入力してください" />
            </Field>
          </FieldGroup>
        </FieldSet>
      </Section>
    </Showcase>
  ),
};

/** 基本形（縦）。 */
export const Default: Story = {
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="d-f-title">件名</FieldLabel>
        <ApplicationInput id="d-f-title" placeholder="備品購入" />
      </Field>
    </FieldGroup>
  ),
};

/** 横並び。チェックボックスと組む。 */
export const Horizontal: Story = {
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <ApplicationCheckbox id="h-f-agree" />
        <FieldLabel htmlFor="h-f-agree">社内規程を確認しました</FieldLabel>
      </Field>
    </FieldGroup>
  ),
};

/** 複数のエラーを配列で渡す。 */
export const WithErrors: Story = {
  render: () => (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="e-f-amount">金額</FieldLabel>
        <ApplicationInput id="e-f-amount" aria-invalid defaultValue="" />
        <FieldError
          errors={[{ message: "金額を入力してください" }, { message: "半角数字で入力してください" }]}
        />
      </Field>
    </FieldGroup>
  ),
};
