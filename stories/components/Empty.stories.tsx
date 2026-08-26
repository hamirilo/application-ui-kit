import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inbox, Search } from "lucide-react";
import {
  ApplicationButton,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../components/application";
import { Section, Showcase } from "../_showcase";

/**
 * Empty は「まだ何も無い」状態の表示。素の shadcn/ui をそのまま公開している。
 *
 * <important>
 * 「そもそも 1 件も無い」と「絞り込んだ結果 0 件」を同じ文言にしてはいけない。
 * 利用者がフィルターを解除すべきなのか、レコードを作るべきなのか判断できなくなる。
 * これはバグとして扱う。
 * </important>
 */
const meta = {
  title: "Data Display/Empty",
  component: Empty,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

一覧・領域に表示するものが無いことを伝え、**次の行動**を示す。ラップしても足せる
value がないため、素の shadcn/ui を re-export している。API は
[shadcn/ui の Empty](https://ui.shadcn.com/docs/components/empty) と同じ。

## 構成

| 部品 | 役割 |
|---|---|
| \`EmptyHeader\` | 図・見出し・説明のまとまり |
| \`EmptyMedia\` | アイコン等。\`variant="icon"\` で丸い枠に収まる |
| \`EmptyTitle\` | 状態を一言で |
| \`EmptyDescription\` | 次の行動 |
| \`EmptyContent\` | ボタン等の操作 |

## 2 つの空状態を書き分ける

| 状態 | 見出し | 説明 |
|---|---|---|
| 1 件も無い | 申請がありません | 「新規申請」から作成してください |
| 絞り込みで 0 件 | 条件に一致する申請がありません | 検索条件を変えてお試しください |

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 読み込み中 | \`Spinner\`（空と読み込み中は別の状態） |
| エラーで表示できない | エラー表示（\`Patterns/ErrorState\` を参照） |
| テーブルの中 | \`ApplicationTable\` の \`emptyMessage\`（枠の中に収まる） |

## 注意事項

- 装飾のためのイラストは置かない。ソースは画像を同梱していない
- 操作を出すのは「作れば解決する」ときだけ。絞り込み 0 件でボタンを出さない
        `,
      },
    },
    controls: { disable: true },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 2 つの空状態の書き分けを 1 画面で比較する。 */
export const Overview: Story = {
  render: () => (
    <Showcase>
      <Section
        title="No Records"
        note="1 件も無い。作れば解決するので操作を出す。"
      >
        <Empty className="rounded-xl border border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox />
            </EmptyMedia>
            <EmptyTitle>申請がありません</EmptyTitle>
            <EmptyDescription>「新規申請」から作成してください</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <ApplicationButton size="sm">新規申請</ApplicationButton>
          </EmptyContent>
        </Empty>
      </Section>

      <Section
        title="No Match"
        note="絞り込みの結果 0 件。作るのではなく条件を変えてもらう。操作は出さない。"
      >
        <Empty className="rounded-xl border border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>条件に一致する申請がありません</EmptyTitle>
            <EmptyDescription>検索条件を変えてお試しください</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Section>

      <Section title="Minimal" note="枠の中に収める場合は図を省いて 1 行で足りる。">
        <Empty className="rounded-xl border border-border py-8">
          <EmptyHeader>
            <EmptyDescription>検索条件に一致する申請が見つかりませんでした</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Section>
    </Showcase>
  ),
};

/** 1 件も無いとき。 */
export const NoRecords: Story = {
  render: () => (
    <Empty className="rounded-xl border border-border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>申請がありません</EmptyTitle>
        <EmptyDescription>「新規申請」から作成してください</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <ApplicationButton size="sm">新規申請</ApplicationButton>
      </EmptyContent>
    </Empty>
  ),
};

/** 絞り込みの結果 0 件。文言を NoRecords と混同しない。 */
export const NoMatch: Story = {
  render: () => (
    <Empty className="rounded-xl border border-border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>条件に一致する申請がありません</EmptyTitle>
        <EmptyDescription>検索条件を変えてお試しください</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

/** 図を省いた最小形。 */
export const Minimal: Story = {
  render: () => (
    <Empty className="rounded-xl border border-border py-8">
      <EmptyHeader>
        <EmptyDescription>検索条件に一致する申請が見つかりませんでした</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};
