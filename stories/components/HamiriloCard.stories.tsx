import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreVertical } from "lucide-react";
import { HamiriloButton, HamiriloCard, HamiriloDropdown } from "../../components/hamirilo";

/**
 * HamiriloCard はコンテンツをひとまとまりに見せるための枠。
 *
 * <important>
 * markup（.html）では `<div class="card">` を使う。
 * HamiriloCard は React application の中でだけ使う。見本は Foundations を参照。
 * </important>
 */
const meta = {
  title: "Components/HamiriloCard",
  component: HamiriloCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

カードの角丸・ボーダー・影・内側余白を固定する。
CSS クラスの \`.card\` / \`.card-sm\` / \`.card-lg\` と**同じ見た目**になるよう実装してある
（\`rounded-xl\` + \`border\` 1px + \`shadow-sm\` + \`p-3\`/\`p-4\`/\`p-6\`）。

## 使う場面

- React application 内で情報をグループ化する
- フォーム・一覧・サマリーの入れ物

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| markup（.html） | \`<div class="card">\` |
| カードの中にさらにカード | ネスト禁止。内側は \`border-t\` の区切りか \`bg-muted\` の区画にする |
| 業務固有のカード（VideoCard / EmployeeCard など） | 各アプリで実装する。中身の意味が業務ごとに違うため共通化しない（ただし外枠に HamiriloCard を使うのは良い） |
| クリックできる一覧項目 | カードではなくテーブル（\`HamiriloTable\`）かリストを検討する。カードは並べると走査しにくい |

## 注意事項

- **影は \`shadow-sm\` のみ。** \`shadow-md\` 以上で目立たせようとしない
  （画面ごとに深さがばらついて散らかって見える）
- **カードを入れ子にしない。** 影付きの中に影付きを置くと境界が判別できなくなる
- \`padding\` で余白を変える。\`className="p-2"\` のような上書きはしない
  （後で \`.card\` の定義を変えたときに追従しない）
- \`title\` は \`h3\` 相当で描画される。**見出しレベルの階層が合わない場合は
  \`title\` を使わず children に適切な要素を置く**（\`h2\` が必要な場面など）
- セマンティックトークン（\`bg-card\` / \`text-card-foreground\` / \`border-border\`）を
  使っているため、HamiriloCard 自体はダークモードで崩れない
        `,
      },
    },
  },
  argTypes: {
    padding: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "内側の余白。CSS クラスの card-sm / card / card-lg に対応",
    },
    title: { control: "text" },
    action: { table: { disable: true } },
    footer: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    children: "カードの中身がここに入ります。",
  },
} satisfies Meta<typeof HamiriloCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基本形（`padding="md"` = `.card` と同じ `p-4`）。 */
export const Default: Story = {};

/** 見出し付き。`title` は `h3` 相当で描画される。 */
export const WithTitle: Story = {
  args: {
    title: "申請の概要",
    children: (
      <p className="text-sm text-muted-foreground">申請の内容と現在のステータスを表示します。</p>
    ),
  },
};

/**
 * 見出しの右にアクションを置く例。
 *
 * 見出しとアクションは `justify-between` で両端に配置される。
 */
export const WithAction: Story = {
  args: {
    title: "添付ファイル",
    action: (
      <HamiriloButton variant="secondary" size="sm">
        追加
      </HamiriloButton>
    ),
    children: <p className="text-sm text-muted-foreground">まだ添付ファイルはありません。</p>,
  },
};

/** アクションにメニューを置く例（項目が 3 つ以上ならボタンを並べずメニューにする）。 */
export const WithMenuAction: Story = {
  args: {
    title: "備品購入の申請",
    action: (
      <HamiriloDropdown
        trigger={
          <HamiriloButton variant="ghost" size="sm" aria-label="操作メニュー">
            <MoreVertical className="w-4 h-4" />
          </HamiriloButton>
        }
        items={[
          { key: "edit", label: "編集" },
          { key: "duplicate", label: "複製" },
          { key: "delete", label: "削除", danger: true, separatorBefore: true },
        ]}
      />
    ),
    children: <p className="text-sm text-muted-foreground">申請番号: SYS-2026-0001</p>,
  },
};

/**
 * フッター付き。
 *
 * フッターは区切り線付きで右寄せになる。確定・キャンセルの配置に使う。
 * **キャンセルは左、主アクションは右**に置く（実行するものを親指側に置く）。
 */
export const WithFooter: Story = {
  args: {
    title: "申請内容の確認",
    children: (
      <p className="text-sm text-muted-foreground">
        この内容で申請します。送信後は編集できません。
      </p>
    ),
    footer: (
      <>
        <HamiriloButton variant="secondary">キャンセル</HamiriloButton>
        <HamiriloButton variant="primary">申請する</HamiriloButton>
      </>
    ),
  },
};

/** 余白のバリエーション。CSS クラスと 1 対 1 で対応する。 */
export const Paddings: Story = {
  render: () => (
    <div className="space-y-3">
      <HamiriloCard padding="sm">
        <code className="text-xs">padding=&quot;sm&quot;</code> ={" "}
        <code className="text-xs">.card-sm</code>（p-3）
      </HamiriloCard>
      <HamiriloCard padding="md">
        <code className="text-xs">padding=&quot;md&quot;</code> ={" "}
        <code className="text-xs">.card</code>（p-4・標準）
      </HamiriloCard>
      <HamiriloCard padding="lg">
        <code className="text-xs">padding=&quot;lg&quot;</code> ={" "}
        <code className="text-xs">.card-lg</code>（p-6）
      </HamiriloCard>
    </div>
  ),
};

/**
 * カードを並べる例。
 *
 * 間隔は `gap-4`、レスポンシブは 1 列 → 2 列 → 3 列。
 * **カードの高さは揃えない**（中身の量が違うのに揃えると余白が不自然になる）。
 */
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <HamiriloCard title="未対応">
        <p className="text-2xl font-bold text-foreground">12</p>
        <p className="text-xs text-muted-foreground">件</p>
      </HamiriloCard>
      <HamiriloCard title="対応中">
        <p className="text-2xl font-bold text-foreground">5</p>
        <p className="text-xs text-muted-foreground">件</p>
      </HamiriloCard>
      <HamiriloCard title="今月の完了">
        <p className="text-2xl font-bold text-foreground">38</p>
        <p className="text-xs text-muted-foreground">件</p>
      </HamiriloCard>
    </div>
  ),
};

/**
 * 入れ子にしたい場合の代替。
 *
 * カードの中にカードは置かず、`border-t` の区切りか `bg-muted` の区画で表現する。
 */
export const InsteadOfNesting: Story = {
  render: () => (
    <HamiriloCard title="申請の詳細">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">申請番号: SYS-2026-0001</p>

        {/* ✓ 内側はカードにせず bg-muted の区画にする */}
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs font-semibold text-muted-foreground">承認履歴</p>
          <p className="mt-1 text-sm text-foreground">2026-07-30 課長承認</p>
        </div>

        {/* ✓ もしくは区切り線で分ける */}
        <div className="border-t border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground">備考</p>
          <p className="mt-1 text-sm text-foreground">特になし</p>
        </div>
      </div>
    </HamiriloCard>
  ),
};
