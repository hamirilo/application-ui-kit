import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApplicationInput, Label, Textarea } from "../../components/application";
import { Section, Showcase, Stack } from "../_showcase";

/**
 * Label は入力欄の見出し。素の shadcn/ui をそのまま公開している。
 *
 * <important>
 * ラベルは必ず \`htmlFor\` で入力欄と結び付ける。結び付いていないラベルは
 * クリックしても入力欄にフォーカスが移らず、スクリーンリーダーも読み上げない。
 * </important>
 */
const meta = {
  title: "Primitives/Label",
  component: Label,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

入力欄の見出しを表す。ラップしても足せる value がないため、素の shadcn/ui を
re-export している。API は [shadcn/ui の Label](https://ui.shadcn.com/docs/components/label)
と同じで、\`label\` の属性をそのまま受け取る。

## 使う場面

- \`Label\` 単体で入力欄に見出しを付けるとき

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| ラベル + ヘルプ + エラーをまとめたいとき | \`ApplicationFormField\`（この 3 つの余白関係が固定されている） |
| fieldset 単位のまとまり | \`Field\` / \`FieldSet\` / \`FieldLegend\` |
| 表示専用の項目名 | \`text-muted-foreground\` の \`span\`（label は入力欄と対で使う） |

## 注意事項

- 必須項目は \`*\` に加えてスクリーンリーダー専用の「（必須）」を添える
- ラベル → 入力欄の余白は 6px に固定（\`tokens/spacing.css\`）
- 文字ウェイトは 500。見出しではないので太くしない
        `,
      },
    },
  },
  args: { children: "件名" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基本・必須・複数行との組み合わせを 1 画面で比較する。 */
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Showcase>
      <Section title="Basic" note="htmlFor と入力欄の id を必ず対応させる。">
        <Stack>
          <div className="space-y-1.5">
            <Label htmlFor="ov-title">件名</Label>
            <ApplicationInput id="ov-title" placeholder="備品購入" />
          </div>
        </Stack>
      </Section>

      <Section
        title="Required"
        note="記号だけに頼らない。読み上げ用の「（必須）」を sr-only で添える。"
      >
        <Stack>
          <div className="space-y-1.5">
            <Label htmlFor="ov-amount">
              金額
              <span aria-hidden="true" className="text-danger">
                *
              </span>
              <span className="sr-only">（必須）</span>
            </Label>
            <ApplicationInput id="ov-amount" placeholder="78000" />
          </div>
        </Stack>
      </Section>

      <Section title="With Textarea" note="複数行入力でも結び付けかたは同じ。">
        <Stack>
          <div className="space-y-1.5">
            <Label htmlFor="ov-note">備考</Label>
            <Textarea id="ov-note" placeholder="補足があれば入力してください" />
          </div>
        </Stack>
      </Section>
    </Showcase>
  ),
};

/** 基本形。 */
export const Default: Story = {};

/** 必須マーク付き。 */
export const Required: Story = {
  render: () => (
    <Label htmlFor="req-amount">
      金額
      <span aria-hidden="true" className="text-danger">
        *
      </span>
      <span className="sr-only">（必須）</span>
    </Label>
  ),
};
