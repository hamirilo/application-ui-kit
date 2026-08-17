import type { Meta, StoryObj } from "@storybook/react-vite";
import { HamiriloButton, HamiriloToast, HamiriloToaster } from "../../components/hamirilo";

const meta = {
  title: "Components/Toast",
  component: HamiriloToaster,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HamiriloToaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-6">
      <HamiriloButton onClick={() => HamiriloToast.success("保存しました")}>
        Success
      </HamiriloButton>
      <HamiriloButton onClick={() => HamiriloToast.error("保存に失敗しました")}>
        Error
      </HamiriloButton>
      <HamiriloButton onClick={() => HamiriloToast.warning("注意してください")}>
        Warning
      </HamiriloButton>
      <HamiriloButton onClick={() => HamiriloToast.info("新しい情報があります")}>
        Info
      </HamiriloButton>
      <HamiriloToaster />
    </div>
  ),
};
