import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApplicationButton, Separator } from "../../components/application";
import { Frame, Section, Showcase } from "../_showcase";

/**
 * Separator は領域を区切る 1px の細線。素の shadcn/ui をそのまま公開している。
 *
 * <important>
 * 区切りは影ではなく 1px の線で作る。線を足す前に、余白だけで区切りが
 * 読み取れないか確認する。線が多い画面は密度が高く見えて読みにくい。
 * </important>
 */
const meta = {
  title: "Primitives/Separator",
  component: Separator,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

意味の切れ目を 1px の \`--color-border\` の線で示す。ラップしても足せる value が
ないため、素の shadcn/ui を re-export している。API は
[shadcn/ui の Separator](https://ui.shadcn.com/docs/components/separator) と同じ。

## 使う場面

- メニュー項目のグループの間
- カード内でヘッダーと本文を分けるとき
- ツールバーでアクションの系統を分けるとき（\`orientation="vertical"\`）

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 表の行間 | \`ApplicationTable\`（行罫は内部で持っている） |
| フォーム項目の間 | 余白（\`space-y-4\`）。線を入れると密度が上がりすぎる |
| セクション見出しの下線 | 見出し側の \`border-b\`（\`Section\` の実装を参照） |

## 注意事項

- \`orientation="vertical"\` は親が高さを持っている（\`flex\` の中等）ことが前提
- 装飾目的の線は入れない。区切る意味が無い線は削る
        `,
      },
    },
    controls: { disable: true },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 向きと実際の置き方を 1 画面で比較する。 */
export const Overview: Story = {
  render: () => (
    <Showcase>
      <Section title="Horizontal" note="既定。親の幅いっぱいに引く。">
        <div className="max-w-md space-y-3">
          <p className="text-sm">申請の基本情報</p>
          <Separator />
          <p className="text-sm text-muted-foreground">
            申請番号・件名・金額はここに入ります。
          </p>
        </div>
      </Section>

      <Section
        title="Vertical"
        note="親が高さを持っている必要がある。ツールバーで系統を分けるときに使う。"
      >
        <Frame>
          <div className="flex items-center gap-3">
            <ApplicationButton size="sm">新規申請</ApplicationButton>
            <Separator orientation="vertical" className="h-6" />
            <ApplicationButton size="sm" variant="secondary">
              CSV 出力
            </ApplicationButton>
            <ApplicationButton size="sm" variant="secondary">
              印刷
            </ApplicationButton>
          </div>
        </Frame>
      </Section>

      <Section title="In Card" note="ヘッダーと本文の切れ目。カードは入れ子にしない。">
        <Frame className="max-w-md space-y-3">
          <div>
            <p className="text-sm font-semibold">SYS-2026-0001</p>
            <p className="text-xs text-muted-foreground">備品購入（モニター 2 台）</p>
          </div>
          <Separator />
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">金額</span>
            <span className="font-medium">78,000 円</span>
          </div>
        </Frame>
      </Section>
    </Showcase>
  ),
};

/** 基本形（横）。 */
export const Default: Story = {
  render: () => (
    <div className="max-w-md">
      <Separator />
    </div>
  ),
};

/** 縦。親の高さが必要。 */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-3 text-sm">
      <span>下書き</span>
      <Separator orientation="vertical" />
      <span>申請中</span>
      <Separator orientation="vertical" />
      <span>承認済み</span>
    </div>
  ),
};
