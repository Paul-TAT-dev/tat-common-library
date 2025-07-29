import { Meta, StoryObj } from "@storybook/react";
import SearchDropdown from "./SearchDropdown";

const meta: Meta<typeof SearchDropdown> = {
  component: SearchDropdown,
  title: "Components/SearchDropdown",
};

export default meta;
type Story = StoryObj<typeof SearchDropdown>;

export const Default: Story = {
  args: {
    id: "itemList",
    value: "",
    isLoading: false,
    options: [
      { id: "1", label: "Item 1" },
      { id: "2", label: "Item 2" },
      { id: "3", label: "Item 3" },
    ],
    placeholder: "-- Select an option --",
    loadingMessage: "Loading...",
    noDataMessage: "No matches found",
    onChange: () => {},
  },
};

export const Loading: Story = {
  args: {
    id: "itemList",
    value: "",
    isLoading: true,
    options: [
      { id: "1", label: "Item 1" },
      { id: "2", label: "Item 2" },
      { id: "3", label: "Item 3" },
    ],
    placeholder: "-- Select an option --",
    loadingMessage: "Loading...",
    noDataMessage: "No matches found",
    onChange: () => {},
  },
};
