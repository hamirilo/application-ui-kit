import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronRight, FileText, User } from "lucide-react";
import {
  ApplicationBadge,
  ApplicationButton,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "../../components/application";
import { Labeled, Section, Showcase, Stack } from "../_showcase";

/**
 * Item は「図 + 本文 + 操作」の 1 行。素の shadcn/ui をそのまま公開している。
 *
 * <important>
 * 列が揃っていて並び替え・選択が要るなら \`ApplicationTable\` を使う。
 * Item は列が揃わない一覧（通知・履歴・設定項目）のためのもの。
 * 表の代わりに Item を並べると、列が揃わず走査しづらくなる。
 * </important>
 */
const meta = {
  title: "Data Display/Item",
  component: Item,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

図・本文・操作を横に並べた 1 行を作る。ラップしても足せる value がないため、
素の shadcn/ui を re-export している。API は
[shadcn/ui の Item](https://ui.shadcn.com/docs/components/item) と同じ。

## 構成

| 部品 | 役割 |
|---|---|
| \`ItemGroup\` | 複数の Item をまとめる |
| \`ItemSeparator\` | Item の間の区切り線 |
| \`ItemMedia\` | 左の図。\`variant="icon"\` / \`"image"\` |
| \`ItemContent\` | 本文のまとまり |
| \`ItemTitle\` / \`ItemDescription\` | 見出しと補足 |
| \`ItemActions\` | 右端の操作 |

## variant / size

| プロパティ | 値 |
|---|---|
| \`variant\` | \`default\` / \`outline\` / \`muted\` |
| \`size\` | \`default\` / \`sm\` / \`xs\` |

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 列が揃った一覧・並び替え・選択 | \`ApplicationTable\` |
| サイドバーのナビゲーション | \`ApplicationNavItem\` |
| 1 件の詳細をまとめて見せる | \`Card\` |

## 注意事項

- 行全体をクリックさせるなら \`render\` で \`a\` / \`button\` に差し替える
- 右端に操作を複数置かない。主要操作 1 つに絞るか \`ApplicationDropdown\` にまとめる
        `,
      },
    },
    controls: { disable: true },
  },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

/** variant・size・実際の並べ方を 1 画面で比較する。 */
export const Overview: Story = {
  render: () => (
    <Showcase>
      <Section title="Variants" note="outline は単独で置くとき、muted は背景に沈めたいとき。">
        <Stack className="max-w-lg">
          <Labeled label="default">
            <Item>
              <ItemMedia variant="icon">
                <FileText />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>備品購入（モニター 2 台）</ItemTitle>
                <ItemDescription>SYS-2026-0001 ・ 78,000 円</ItemDescription>
              </ItemContent>
            </Item>
          </Labeled>
          <Labeled label="outline">
            <Item variant="outline">
              <ItemMedia variant="icon">
                <FileText />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>出張費精算（大阪）</ItemTitle>
                <ItemDescription>SYS-2026-0002 ・ 45,800 円</ItemDescription>
              </ItemContent>
            </Item>
          </Labeled>
          <Labeled label="muted">
            <Item variant="muted">
              <ItemMedia variant="icon">
                <FileText />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>書籍購入</ItemTitle>
                <ItemDescription>SYS-2026-0003 ・ 3,200 円</ItemDescription>
              </ItemContent>
            </Item>
          </Labeled>
        </Stack>
      </Section>

      <Section title="Sizes" note="密度の高い一覧では sm / xs にする。">
        <Stack className="max-w-lg">
          <Labeled label="default">
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>既定</ItemTitle>
              </ItemContent>
            </Item>
          </Labeled>
          <Labeled label="sm">
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>sm</ItemTitle>
              </ItemContent>
            </Item>
          </Labeled>
          <Labeled label="xs">
            <Item variant="outline" size="xs">
              <ItemContent>
                <ItemTitle>xs</ItemTitle>
              </ItemContent>
            </Item>
          </Labeled>
        </Stack>
      </Section>

      <Section title="With Actions" note="右端の操作は 1 つに絞る。複数あるならまとめる。">
        <div className="max-w-lg">
          <ItemGroup>
            <Item>
              <ItemMedia variant="icon">
                <User />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>山田 太郎</ItemTitle>
                <ItemDescription>総務部 ・ 一次承認者</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ApplicationBadge tone="active">対応中</ApplicationBadge>
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item>
              <ItemMedia variant="icon">
                <User />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>鈴木 花子</ItemTitle>
                <ItemDescription>経理部 ・ 最終承認者</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ApplicationButton variant="ghost" size="sm">
                  変更
                </ApplicationButton>
              </ItemActions>
            </Item>
          </ItemGroup>
        </div>
      </Section>

      <Section title="Clickable Row" note="行全体を押させるなら render で a / button に差し替える。">
        <div className="max-w-lg">
          <Item variant="outline" render={<a href="#detail" />}>
            <ItemMedia variant="icon">
              <FileText />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>研修参加費</ItemTitle>
              <ItemDescription>SYS-2026-0004 ・ 120,000 円</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRight className="size-4 text-muted-foreground" />
            </ItemActions>
          </Item>
        </div>
      </Section>
    </Showcase>
  ),
};

/** 基本形。 */
export const Default: Story = {
  render: () => (
    <div className="max-w-lg">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <FileText />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>備品購入（モニター 2 台）</ItemTitle>
          <ItemDescription>SYS-2026-0001 ・ 78,000 円</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
};

/** 区切り線付きの一覧。 */
export const Grouped: Story = {
  render: () => (
    <div className="max-w-lg">
      <ItemGroup>
        <Item>
          <ItemContent>
            <ItemTitle>備品購入（モニター 2 台）</ItemTitle>
            <ItemDescription>78,000 円</ItemDescription>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item>
          <ItemContent>
            <ItemTitle>出張費精算（大阪）</ItemTitle>
            <ItemDescription>45,800 円</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </div>
  ),
};

/** 行全体がリンク。 */
export const Clickable: Story = {
  render: () => (
    <div className="max-w-lg">
      <Item variant="outline" render={<a href="#detail" />}>
        <ItemContent>
          <ItemTitle>研修参加費</ItemTitle>
          <ItemDescription>SYS-2026-0004</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRight className="size-4 text-muted-foreground" />
        </ItemActions>
      </Item>
    </div>
  ),
};
