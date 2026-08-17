import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ApplicationActiveIndicator } from "../../components/application/ApplicationActiveIndicator";

const meta = {
  title: "Components/ApplicationActiveIndicator",
  component: ApplicationActiveIndicator,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**ApplicationActiveIndicator** は、Framer Motion の Shared Layout アニメーションを利用したアクティブハイライトインジケーターです。

- **滑らかなアニメーション**: タブやナビゲーション間で選択状態が変わる際に動的に枠線・背景色が滑らかにスライド移動します。
- **柔軟なレイアウトID**: \`layoutId\` プロパティで同一グループ内のインジケーター同士を結びつけます。
        `,
      },
    },
  },
} satisfies Meta<typeof ApplicationActiveIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SharedLayoutDemo: Story = {
  render: () => {
    const [selected, setSelected] = useState("tab1");
    const tabs = [
      { id: "tab1", label: "概要" },
      { id: "tab2", label: "詳細設定" },
      { id: "tab3", label: "ログ" },
    ];

    return (
      <div className="flex space-x-2 bg-gray-100 p-2 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelected(tab.id)}
            className="relative px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer outline-none"
          >
            {selected === tab.id && <ApplicationActiveIndicator layoutId="active-indicator-demo" />}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
    );
  },
};
