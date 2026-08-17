import type { Meta, StoryObj } from "@storybook/react-vite";
import { HamiriloThemeToggle } from "../../components/hamirilo/HamiriloThemeToggle";

const meta = {
  title: "Components/HamiriloThemeToggle",
  component: HamiriloThemeToggle,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
**HamiriloThemeToggle** は、ライトモード／ダークモードを切り替えるボタンコンポーネントです。

- **自動状態切り替え**: デフォルトで HTML の \`.dark\` クラスおよび \`localStorage\` の自動同期・永続化を行います。
- **制御モード**: \`theme\` プロパティや \`onToggle\` ハンドラーを指定して親コンポーネント側でテーマ状態を制御することも可能です。
        `,
      },
    },
  },
} satisfies Meta<typeof HamiriloThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ControlledLight: Story = {
  args: {
    theme: "light",
  },
};

export const ControlledDark: Story = {
  args: {
    theme: "dark",
  },
};
