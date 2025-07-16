import { Meta, StoryObj } from "@storybook/react";
import Tab from "./Tab";

const meta: Meta<typeof Tab> = {
  component: Tab,
  title: "Components/Tab",
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {
  args: {
    value: "Tab 1",
    isSelected: false,
    onClick: () => {},
  },
};
