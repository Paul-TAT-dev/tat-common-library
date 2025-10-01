import { Meta, StoryObj } from "@storybook/react";
import input from "./input";

const meta: Meta<typeof input> = {
  component: input,
  title: "Components/input",
};

export default meta;
type Story = StoryObj<typeof input>;

export const Default: Story = {
  args: {
    id: "Input",
    value: "",
    placeholder: "-- Placeholder --",
    label: "Input label here",
    onChange: () => {},
    required: true,
  },
};
