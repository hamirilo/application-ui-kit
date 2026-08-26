import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, Textarea } from "../../components/application";
import { Labeled, Section, Showcase, Stack } from "../_showcase";

/**
 * Textarea は複数行の文字入力。素の shadcn/ui をそのまま公開している。
 *
 * <important>
 * 高さは \`field-sizing-content\` により入力量で伸びる。行数を固定したいときだけ
 * \`rows\` を渡す。\`resize\` を切らないこと（利用者が読める幅を自分で決められなくなる）。
 * </important>
 */
const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

備考・理由・コメントのような複数行の入力を受け取る。ラップしても足せる value が
ないため、素の shadcn/ui を re-export している。API は
[shadcn/ui の Textarea](https://ui.shadcn.com/docs/components/textarea) と同じで、
\`textarea\` の属性をそのまま受け取る。

## 使う場面

- 差戻し理由・申請の備考など、文章を書かせる項目
- 1 行に収まらないことが前提の入力

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 1 行の文字入力 | \`ApplicationInput\` |
| ラベル・ヘルプ・エラーをまとめたいとき | \`ApplicationFormField\` |
| 検索 | \`ApplicationSearchInput\` |

## 注意事項

- 最小高さは \`min-h-16\`。入力量に応じて自動で伸びる
- エラーは \`aria-invalid\` を起点に出す。クラスを足して赤くしない
- 文字数制限があるならヘルプテキストに「50 文字以内」と明示する
        `,
      },
    },
  },
  args: { placeholder: "補足があれば入力してください" },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 状態の一覧を 1 画面で比較する。 */
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Showcase>
      <Section title="States" note="エラーは aria-invalid が起点。色クラスを直接足さない。">
        <Stack className="max-w-md">
          <Labeled label="既定">
            <Textarea placeholder="補足があれば入力してください" />
          </Labeled>
          <Labeled label="入力済み">
            <Textarea defaultValue={"モニターは 27 インチを希望します。\n設置は総務にて対応。"} />
          </Labeled>
          <Labeled label="disabled">
            <Textarea disabled placeholder="編集できません" />
          </Labeled>
          <Labeled label="aria-invalid">
            <Textarea aria-invalid defaultValue="" placeholder="理由を入力してください" />
          </Labeled>
        </Stack>
      </Section>

      <Section title="Rows" note="行数を固定したいときだけ rows を渡す。既定は内容で伸びる。">
        <Stack className="max-w-md">
          <Labeled label="rows=2">
            <Textarea rows={2} placeholder="2 行分" />
          </Labeled>
          <Labeled label="rows=6">
            <Textarea rows={6} placeholder="6 行分" />
          </Labeled>
        </Stack>
      </Section>

      <Section title="With Label" note="ラベル → 入力欄の余白は 6px に固定。">
        <Stack className="max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="ov-reason">差戻し理由</Label>
            <Textarea id="ov-reason" placeholder="修正してほしい点を具体的に書いてください" />
            <p className="text-xs text-muted-foreground">200 文字以内</p>
          </div>
        </Stack>
      </Section>
    </Showcase>
  ),
};

/** 基本形。 */
export const Default: Story = {};

/** 入力済み。 */
export const Filled: Story = {
  args: { defaultValue: "モニターは 27 インチを希望します。" },
};

/** 編集できない状態。 */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "確定済みのため編集できません" },
};

/** エラー。aria-invalid を起点に見た目が変わる。 */
export const Invalid: Story = {
  args: { "aria-invalid": true, placeholder: "理由を入力してください" },
};
