import { Meta, StoryObj } from "@storybook/react";
import Tooltip from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: "Components/Tooltip",
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    info: "Hello world",
  },
};
