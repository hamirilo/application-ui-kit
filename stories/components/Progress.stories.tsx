import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "../../components/application";
import { Labeled, Section, Showcase, Stack } from "../_showcase";

/**
 * Progress は進捗率を示すバー。素の shadcn/ui をそのまま公開している。
 *
 * <important>
 * 進捗率が分からない処理に使ってはいけない。値が無いまま置くと
 * 「いつ終わるか分かる」という誤った期待を与える。分からないときは \`Spinner\`。
 * </important>
 */
const meta = {
  title: "Data Display/Progress",
  component: Progress,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

完了率が数値で分かる処理の進捗を示す。ラップしても足せる value がないため、
素の shadcn/ui を re-export している。API は
[shadcn/ui の Progress](https://ui.shadcn.com/docs/components/progress) と同じ
（Base UI の Progress がベース）。

## 構成

\`Progress\` はトラックとインジケーターを内部で描画する。子に渡すのは
ラベルと数値だけ。

| 部品 | 役割 |
|---|---|
| \`ProgressLabel\` | 何の進捗かを示す文字 |
| \`ProgressValue\` | 現在値の表示（既定で百分率） |

## 使う場面

- ファイルのアップロード・一括処理の進捗
- 入力の完了率（申請の記入状況等）

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 完了率が分からない処理 | \`Spinner\` |
| 達成率・構成比の可視化 | チャート（Recommendations を参照） |
| ステップの現在地 | \`ApplicationTabs\` 等のナビゲーション |

## 注意事項

- \`value\` は 0〜100。\`null\` は不定状態を意味するため、使うなら \`Spinner\` を検討する
- バーの色だけで成否を伝えない。文字で状態を示す
        `,
      },
    },
  },
  args: { value: 60 },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 値の段階とラベルの付け方を 1 画面で比較する。 */
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Showcase>
      <Section title="Values" note="0〜100。数値が分かる処理にだけ使う。">
        <Stack className="max-w-md">
          <Labeled label="0">
            <Progress value={0} />
          </Labeled>
          <Labeled label="35">
            <Progress value={35} />
          </Labeled>
          <Labeled label="60">
            <Progress value={60} />
          </Labeled>
          <Labeled label="100">
            <Progress value={100} />
          </Labeled>
        </Stack>
      </Section>

      <Section title="With Label" note="何の進捗かと現在値を必ず読み取れるようにする。">
        <Stack className="max-w-md">
          <Progress value={45}>
            <ProgressLabel>アップロード中</ProgressLabel>
            <ProgressValue />
          </Progress>
        </Stack>
      </Section>

      <Section title="In Context" note="一括処理の進捗。件数を文字でも示す。">
        <div className="max-w-md space-y-2 rounded-xl border border-border bg-card p-4">
          <Progress value={75}>
            <ProgressLabel>申請を一括承認中</ProgressLabel>
            <ProgressValue />
          </Progress>
          <p className="text-xs text-muted-foreground">全 24 件中 18 件を処理しました</p>
        </div>
      </Section>
    </Showcase>
  ),
};

/** 基本形。 */
export const Default: Story = {
  render: (args) => (
    <div className="max-w-md">
      <Progress {...args} />
    </div>
  ),
};

/** ラベルと現在値を添えた形。 */
export const WithLabel: Story = {
  render: () => (
    <div className="max-w-md">
      <Progress value={45}>
        <ProgressLabel>アップロード中</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
};

/** 完了。 */
export const Complete: Story = {
  render: () => (
    <div className="max-w-md">
      <Progress value={100}>
        <ProgressLabel>取り込み完了</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  ),
};
