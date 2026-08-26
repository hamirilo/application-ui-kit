import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApplicationButton, Spinner } from "../../components/application";
import { Cluster, Labeled, Section, Showcase } from "../_showcase";

/**
 * Spinner は処理中を示す回転アイコン。素の shadcn/ui をそのまま公開している。
 *
 * <important>
 * スピナーだけを置いて終わりにしない。何を待っているのかが読み取れないため、
 * 必ず文字（「読み込み中」等）を添えるか、操作したボタンの中に出す。
 * </important>
 */
const meta = {
  title: "Primitives/Spinner",
  component: Spinner,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

処理中であることを示す。ラップしても足せる value がないため、素の shadcn/ui を
re-export している。API は [shadcn/ui の Spinner](https://ui.shadcn.com/docs/components/spinner)
と同じで、\`svg\` の属性をそのまま受け取る。

## 使う場面

- ボタンの中（\`ApplicationButton\` の \`loading\` が内部で使っている）
- 領域全体の読み込み中表示

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 進捗率が分かる処理 | \`Progress\`（残り時間が読めるため体感が良い） |
| 一覧が空のとき | \`Empty\`（読み込み中と空は別の状態） |
| ボタンの loading | \`ApplicationButton\` の \`loading\` プロパティ（自前で組まない） |

## 注意事項

- サイズは \`size-*\` で変える。既定は \`size-4\`（16px = \`--control-icon-size\`）
- 色は \`currentColor\` に従う。\`text-muted-foreground\` 等のトークンで指定する
- \`role="status"\` と \`aria-label="Loading"\` は既定で付いている
        `,
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** サイズ・色・実際の置き方を 1 画面で比較する。 */
export const Overview: Story = {
  render: () => (
    <Showcase>
      <Section title="Sizes" note="既定は size-4。コントロール内では 16px を超えないようにする。">
        <Cluster>
          <Labeled label="size-3">
            <Spinner className="size-3" />
          </Labeled>
          <Labeled label="size-4（既定）">
            <Spinner />
          </Labeled>
          <Labeled label="size-6">
            <Spinner className="size-6" />
          </Labeled>
          <Labeled label="size-8">
            <Spinner className="size-8" />
          </Labeled>
        </Cluster>
      </Section>

      <Section title="Tones" note="色は currentColor。生の色ではなくテキストトークンで指定する。">
        <Cluster>
          <Labeled label="既定">
            <Spinner />
          </Labeled>
          <Labeled label="text-muted-foreground">
            <Spinner className="text-muted-foreground" />
          </Labeled>
          <Labeled label="text-primary">
            <Spinner className="text-primary" />
          </Labeled>
        </Cluster>
      </Section>

      <Section title="With Label" note="スピナー単体では何を待っているか分からない。文字を添える。">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          <span>読み込み中</span>
        </div>
      </Section>

      <Section title="In Button" note="ボタン内は自前で組まず ApplicationButton の loading を使う。">
        <Cluster>
          <ApplicationButton loading>送信中</ApplicationButton>
          <ApplicationButton variant="danger" loading>
            削除中
          </ApplicationButton>
        </Cluster>
      </Section>
    </Showcase>
  ),
};

/** 基本形。 */
export const Default: Story = {};

/** 文字を添えた読み込み中表示。 */
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner />
      <span>読み込み中</span>
    </div>
  ),
};

/** 領域全体の読み込み中。高さを確保して見た目が飛ばないようにする。 */
export const FullArea: Story = {
  render: () => (
    <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-card">
      <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-6" />
        <span>申請を読み込み中</span>
      </div>
    </div>
  ),
};
