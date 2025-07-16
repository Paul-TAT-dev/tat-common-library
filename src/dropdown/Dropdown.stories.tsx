import { Meta, StoryObj } from "@storybook/react";
import Dropdown from "./Dropdown";

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  title: "Components/Dropdown",
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    id: "itemList",
    value: "",
    isLoading: false,
    list: [
      { id: "1", label: "Item 1" },
      { id: "2", label: "Item 2" },
      { id: "3", label: "Item 3" },
    ],
    placeholder: "-- Select an option --",
    loadingMessage: "Loading...",
    noDataMessage: "No matches found",
    handleOnClick: () => {},
  },
};

export const Loading: Story = {
  args: {
    id: "itemList",
    value: "",
    isLoading: true,
    list: [
      { id: "1", label: "Item 1" },
      { id: "2", label: "Item 2" },
      { id: "3", label: "Item 3" },
    ],
    placeholder: "-- Select an option --",
    loadingMessage: "Loading...",
    noDataMessage: "No matches found",
    handleOnClick: () => {},
  },
};
