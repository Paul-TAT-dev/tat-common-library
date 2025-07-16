import { Meta, StoryObj } from "@storybook/react";
import table, { PaginationPosition } from "./table";

const meta: Meta<typeof table> = {
  component: table,
  title: "Components/table",
};

export default meta;
type Story = StoryObj<typeof table>;

export const Default: Story = {
  args: {
    header: [{ label: "ID" }, { label: "Name" }, { label: "Email" }],
    data: [
      [1, "John Doe", "2L2e0@example.com"],
      [2, "Jane Doe", "K2L2e0@example.com"],
    ],
    totalPages: 1,
    itemsPerPage: 10,
    setItemsPerPage: () => {},
    currentPage: 1,
    setCurrentPage: () => {},
    paginationPosition: PaginationPosition.BOTH,
    noDataMessage: "No data found",
  },
};
