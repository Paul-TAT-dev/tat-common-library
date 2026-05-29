import { Meta, StoryObj } from "@storybook/react";
import pagination from "../../../src/table/pagination/pagination";

const meta: Meta<typeof pagination> = {
  component: pagination,
  title: "Components/pagination",
};

export default meta;
type Story = StoryObj<typeof pagination>;

export const Default: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
    setItemsPerPage: () => {},
    currentPage: 1,
    setCurrentPage: () => {},
    onPageChange: () => {},
  },
};
