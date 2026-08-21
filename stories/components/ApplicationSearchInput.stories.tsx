import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ApplicationSearchInput, ApplicationTable } from "../../components/application";

/**
 * ApplicationSearchInput は一覧・テーブルの上に置くフィルタ用検索欄。
 *
 * <important>
 * ラベルを視覚的に置かない場面が多いため、`aria-label` を必ず渡す
 * （`ApplicationFormField` で囲む場合は不要）。
 * </important>
 */
const meta = {
  title: "Components/ApplicationSearchInput",
  component: ApplicationSearchInput,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

検索アイコン + クリアボタンの組み合わせを毎回書かずに済むようにする。
見た目は \`ApplicationInput\` と同じ。

## 使う場面

- 一覧・テーブルの上のキーワード絞り込み

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 選択肢から選ぶ絞り込み | \`ApplicationSelect\` |
| 社員・取引先など候補から選ぶ検索 | Tom Select 等の選択ライブラリ（テンプレート） / Autocomplete（React） |

## 注意事項

- \`onClear\` を渡すと、値がある間だけ右側にクリアボタン（×）が表示される
- \`onClear\` を渡さない場合はクリアボタンなしの検索欄になる（非制御で十分な場合）
- \`type="search"\` を使っているため、ブラウザ標準のクリア用 ×（WebKit）は非表示にしている
        `,
      },
    },
  },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "タイトルで検索",
    "aria-label": "検索",
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApplicationSearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基本形（非制御）。 */
export const Default: Story = {};

/** 操作不可。 */
export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * 制御コンポーネント + クリアボタン。
 *
 * 実際の一覧絞り込みではこの形で使う。
 */
export const Controlled: Story = {
  render: (args) => {
    const [keyword, setKeyword] = React.useState("備品");
    return (
      <ApplicationSearchInput
        {...args}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onClear={() => setKeyword("")}
      />
    );
  },
};

type Row = { id: number; title: string };

/** テーブル上部の絞り込みとして使う実際の使い方。 */
export const WithTable: Story = {
  render: () => {
    const [keyword, setKeyword] = React.useState("");
    const ALL: Row[] = [
      { id: 1, title: "備品購入申請" },
      { id: 2, title: "出張申請" },
      { id: 3, title: "休暇申請" },
    ];
    const rows = ALL.filter((r) => r.title.includes(keyword));

    return (
      <div className="space-y-3">
        <ApplicationSearchInput
          aria-label="件名で検索"
          placeholder="件名で検索"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onClear={() => setKeyword("")}
        />
        <ApplicationTable<Row>
          columns={[{ key: "title", header: "件名", cell: (r) => r.title }]}
          rows={rows}
          rowKey={(r) => r.id}
          emptyMessage="該当する申請がありません"
        />
      </div>
    );
  },
};
