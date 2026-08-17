import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApplicationButton, ApplicationToast, ApplicationToaster } from "../../components/application";

const meta = {
  title: "Components/Toast",
  component: ApplicationToaster,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ApplicationToaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-6">
      <ApplicationButton onClick={() => ApplicationToast.success("保存しました")}>
        Success
      </ApplicationButton>
      <ApplicationButton onClick={() => ApplicationToast.error("保存に失敗しました")}>
        Error
      </ApplicationButton>
      <ApplicationButton onClick={() => ApplicationToast.warning("注意してください")}>
        Warning
      </ApplicationButton>
      <ApplicationButton onClick={() => ApplicationToast.info("新しい情報があります")}>
        Info
      </ApplicationButton>
      <ApplicationToaster />
    </div>
  ),
};
