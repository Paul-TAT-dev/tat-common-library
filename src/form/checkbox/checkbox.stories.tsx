import { Meta, StoryObj } from "@storybook/react";
import checkbox from "./checkbox";

const meta: Meta<typeof checkbox> = {
  component: checkbox,
  title: "Components/checkbox",
};

export default meta;
type Story = StoryObj<typeof checkbox>;

export const Default: Story = {
  args: {
    id: "itemList",
    label: "Item 1",
    isChecked: false,
    onChange: () => {},
  },
};

export const Checked: Story = {
  args: {
    id: "itemList",
    label: "Item 1",
    isChecked: true,
    onChange: () => {},
  },
};
