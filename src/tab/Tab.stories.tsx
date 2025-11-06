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

export const Success: Story = {
  args: {
    value: "Tab 1",
    isSelected: false,
    onClick: () => {},
    status: "success",
  },
};

export const SuccessActive: Story = {
  args: {
    value: "Tab 1",
    isSelected: true,
    onClick: () => {},
    status: "success",
  },
};

export const Alert: Story = {
  args: {
    value: "Tab 1",
    isSelected: false,
    onClick: () => {},
    status: "alert",
  },
};
export const AlertActive: Story = {
  args: {
    value: "Tab 1",
    isSelected: true,
    onClick: () => {},
    status: "alert",
  },
};

export const Error: Story = {
  args: {
    value: "Tab 1",
    isSelected: false,
    onClick: () => {},
    status: "error",
  },
};

export const ErrorActive: Story = {
  args: {
    value: "Tab 1",
    isSelected: true,
    onClick: () => {},
    status: "error",
  },
};

export const Todo: Story = {
  args: {
    value: "Tab 1",
    isSelected: false,
    onClick: () => {},
    status: "todo",
  },
};

export const TodoActive: Story = {
  args: {
    value: "Tab 1",
    isSelected: true,
    onClick: () => {},
    status: "todo",
  },
};
