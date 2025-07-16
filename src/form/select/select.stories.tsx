import { Meta, StoryObj } from "@storybook/react";
import select from "./select";

const meta: Meta<typeof select> = {
  component: select,
  title: "Components/select",
};

export default meta;
type Story = StoryObj<typeof select>;

export const Default: Story = {
  args: {
    id: "select",
    placeholder: "-- Placeholder --",
    label: "Selection",
    options: [
      { id: "1", value: "Item 1" },
      { id: "2", value: "Item 2" },
      { id: "3", value: "Item 3" },
    ],
    value: "",
    onChange: () => {},
  },
};

export const Selected: Story = {
  args: {
    id: "select",
    placeholder: "-- Placeholder --",
    label: "Selection",
    options: [
      { id: "1", value: "Item 1" },
      { id: "2", value: "Item 2" },
      { id: "3", value: "Item 3" },
    ],
    value: "Item 1",
    onChange: () => {},
  },
};
