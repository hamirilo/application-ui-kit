import type { Meta, StoryObj } from "@storybook/react-vite";
import { Archive, Clock, Heart, Inbox, Pin } from "lucide-react";
import { useState } from "react";
import { ApplicationNavItem } from "../../components/application/ApplicationNavItem";

const meta = {
  title: "Components/ApplicationNavItem",
  component: ApplicationNavItem,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**ApplicationNavItem** は、Framer Motion の Shared Layout アニメーション (\`ApplicationActiveIndicator\`) を内蔵した標準ナビゲーションコンポーネントです。

- **セマンティック切り替え**: \`href\` 指定時は \`<a>\` (Link)、未指定時は \`<button>\` に自動切替
- **モーション内蔵**: \`active\` 変更時にアクティブ背景が滑らかに移動
- **カラー選択**: \`primary\`, \`blue\`, \`indigo\`, \`teal\`, \`amber\`, \`rose\`, \`emerald\`
        `,
      },
    },
  },
  args: {
    label: "受信トレイ",
    icon: <Inbox />,
    active: true,
    href: "#",
  },
} satisfies Meta<typeof ApplicationNavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inactive: Story = {
  args: { active: false },
};

export const WithBadge: Story = {
  args: { badge: 12 },
};

export const AnimatedNavigationGroup: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("inbox");

    const items = [
      {
        id: "inbox",
        label: "受信トレイ",
        icon: <Inbox />,
        badge: 5,
        color: "blue" as const,
      },
      {
        id: "someday",
        label: "いつか読む",
        icon: <Clock />,
        badge: 2,
        color: "indigo" as const,
      },
      {
        id: "archive",
        label: "アーカイブ",
        icon: <Archive />,
        color: "teal" as const,
      },
      {
        id: "pinned",
        label: "ピン留め",
        icon: <Pin />,
        color: "amber" as const,
      },
      {
        id: "favorites",
        label: "お気に入り",
        icon: <Heart />,
        color: "rose" as const,
      },
    ];

    return (
      <div className="w-64 space-y-1 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        {items.map((item) => (
          <ApplicationNavItem
            key={item.id}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            activeColor={item.color}
            layoutId="storybook-nav-demo"
          />
        ))}
      </div>
    );
  },
};
