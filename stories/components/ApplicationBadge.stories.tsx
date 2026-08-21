import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertCircle } from "lucide-react";
import { ApplicationBadge, ApplicationTable } from "../../components/application";

/**
 * ApplicationBadge はステータス・種別・優先度を表すピル型ラベル。
 *
 * <important>
 * バッジは色だけに意味を持たせない。現状セマンティックカラーは WCAG AA 未達
 * （ai-dev-standards/accessibility.md）のため、必ず文字（「完了」「未対応」等）で
 * 意味が読み取れるようにする。
 * </important>
 */
const meta = {
  title: "Components/ApplicationBadge",
  component: ApplicationBadge,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

ステータス・種別・優先度の表示を統一する。色の意味は
[colors.md のドメインステータスカラー](../?path=/docs/foundations-colors--docs)に揃えている。

## 使う場面

- 一覧・テーブルのステータス列
- カードの種別・優先度表示

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| テンプレート（.html） | \`badge {{ obj.status_display_class }}\`（\`models.py\` の \`*_display_class\` と組み合わせる） |
| クリックできる操作 | \`ApplicationButton\`（バッジはクリック不可の表示専用） |
| 数値のカウント表示（未読件数等） | 別途 \`avatar-*\` 系のドット表示を検討 |

## tone の対応

| tone | 意味 | 色 |
|---|---|---|
| \`new\` | 新規・未対応・要注意 | Yellow |
| \`active\` | 進行中 | Sky |
| \`done\` | 完了・解決・承認 | Emerald |
| \`warning\` | 差戻し・警告 | Orange |
| \`danger\` | 緊急・エラー・却下 | Rose |
| \`pending\` | 検討中・保留 | Purple |
| \`neutral\`（既定） | 終了・無効・アーカイブ | Gray |

## 注意事項

- **同じ意味の状態には全アプリで同じ tone を使う**（アプリごとに系統を変えない）
- \`models.py\` の \`*_display_class\` プロパティと対応を揃えること
        `,
      },
    },
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["new", "active", "done", "warning", "danger", "pending", "neutral"],
    },
  },
  args: {
    children: "対応中",
    tone: "active",
  },
} satisfies Meta<typeof ApplicationBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 基本形。 */
export const Default: Story = {};

/** アイコン付き。 */
export const WithIcon: Story = {
  args: {
    tone: "danger",
    icon: <AlertCircle className="h-3 w-3" />,
    children: "エラー",
  },
};

/** 全 tone の一覧。 */
export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ApplicationBadge tone="new">受付</ApplicationBadge>
      <ApplicationBadge tone="active">対応中</ApplicationBadge>
      <ApplicationBadge tone="done">完了</ApplicationBadge>
      <ApplicationBadge tone="warning">差戻し</ApplicationBadge>
      <ApplicationBadge tone="danger">却下</ApplicationBadge>
      <ApplicationBadge tone="pending">保留</ApplicationBadge>
      <ApplicationBadge tone="neutral">アーカイブ</ApplicationBadge>
    </div>
  ),
};

type Row = { id: number; title: string; tone: "new" | "active" | "done"; label: string };

/** ApplicationTable のステータス列で使う実際の使い方。 */
export const InTable: Story = {
  render: () => {
    const rows: Row[] = [
      { id: 1, title: "備品購入申請", tone: "new", label: "未対応" },
      { id: 2, title: "出張申請", tone: "active", label: "対応中" },
      { id: 3, title: "休暇申請", tone: "done", label: "完了" },
    ];
    return (
      <ApplicationTable<Row>
        columns={[
          { key: "title", header: "件名", cell: (r) => r.title },
          {
            key: "status",
            header: "ステータス",
            cell: (r) => <ApplicationBadge tone={r.tone}>{r.label}</ApplicationBadge>,
          },
        ]}
        rows={rows}
        rowKey={(r) => r.id}
      />
    );
  },
};
