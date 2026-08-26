import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ApplicationBadge,
  ApplicationButton,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "../../components/application";
import { Grid, Section, Showcase } from "../_showcase";

/**
 * Card は情報をひとまとまりに見せるサーフェス。素の shadcn/ui をそのまま公開している。
 *
 * <important>
 * カードは入れ子にしない。長いフォームは、それぞれにタイトルを付けた
 * 兄弟関係のカードに分ける。入れ子にすると境界が二重になり、
 * どこが 1 つのまとまりなのか読み取れなくなる。
 * </important>
 */
const meta = {
  title: "Surfaces/Card",
  component: Card,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

関連する情報をひとまとまりとして囲む。ラップしても足せる value がないため、
素の shadcn/ui を re-export している。API は
[shadcn/ui の Card](https://ui.shadcn.com/docs/components/card) と同じ。

「カード」の定義は 12px の角丸 + 1px のボーダー + \`shadow-sm\` +
\`--color-card\` の地色。テンプレート側の \`.card\`（\`tokens/patterns.css\`）と
意図的にピクセル単位で一致させている。

## 構成

| 部品 | 役割 |
|---|---|
| \`CardHeader\` | タイトル・説明・アクションを載せる帯 |
| \`CardTitle\` | 見出し |
| \`CardDescription\` | 補足の 1 行 |
| \`CardAction\` | ヘッダー右端のアクション |
| \`CardContent\` | 本文 |
| \`CardFooter\` | 下端のアクション列 |

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| カードの中にカード | 兄弟のカードに分ける（入れ子にしない） |
| 一覧の行 | \`ApplicationTable\` / \`Item\` |
| 浮かせたい一時的な面 | \`ApplicationDialog\`（カードは通常の流れに乗る面） |

## 注意事項

- 影は \`shadow-sm\` のみ。\`shadow-md\` 以上は使わない
- \`size="sm"\` はパディングを詰める。密度の高い一覧の中で使う
        `,
      },
    },
    controls: { disable: true },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 構成・サイズ・実際の置き方を 1 画面で比較する。 */
export const Overview: Story = {
  render: () => (
    <Showcase>
      <Section title="Anatomy" note="ヘッダー・本文・フッターの 3 段。全部を使う必要はない。">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>SYS-2026-0001</CardTitle>
            <CardDescription>備品購入（モニター 2 台）</CardDescription>
            <CardAction>
              <ApplicationBadge tone="new">未対応</ApplicationBadge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">申請者</span>
                <span>山田 太郎</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">金額</span>
                <span className="font-medium">78,000 円</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <ApplicationButton variant="secondary" size="sm">
              差戻し
            </ApplicationButton>
            <ApplicationButton size="sm">承認</ApplicationButton>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Sizes" note="密度の高い一覧の中では sm を使う。">
        <Grid>
          <Card size="sm">
            <CardHeader>
              <CardTitle>size=&quot;sm&quot;</CardTitle>
              <CardDescription>パディングを詰めた形</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>既定</CardTitle>
              <CardDescription>16px のパディング</CardDescription>
            </CardHeader>
          </Card>
        </Grid>
      </Section>

      <Section
        title="Siblings, Not Nested"
        note="長いフォームはカードを入れ子にせず、タイトル付きの兄弟カードに分ける。"
      >
        <div className="max-w-md space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>申請内容</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              件名・金額・希望納期
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>承認経路</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              一次承認・最終承認
            </CardContent>
          </Card>
        </div>
      </Section>
    </Showcase>
  ),
};

/** 基本形。 */
export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>申請内容</CardTitle>
        <CardDescription>備品購入（モニター 2 台）</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">78,000 円</CardContent>
    </Card>
  ),
};

/** ヘッダーだけ。本文が無いときフッターも省く。 */
export const HeaderOnly: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>承認経路</CardTitle>
        <CardDescription>一次承認 → 最終承認</CardDescription>
      </CardHeader>
    </Card>
  ),
};

/** フッターにアクションを置く。主要操作は 1 つに絞る。 */
export const WithFooter: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>差戻し</CardTitle>
        <CardDescription>理由を入力すると申請者に通知されます。</CardDescription>
      </CardHeader>
      <CardFooter className="justify-end gap-2">
        <ApplicationButton variant="secondary" size="sm">
          キャンセル
        </ApplicationButton>
        <ApplicationButton variant="danger" size="sm">
          差戻し
        </ApplicationButton>
      </CardFooter>
    </Card>
  ),
};
