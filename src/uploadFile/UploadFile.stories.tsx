import { Meta, StoryObj } from "@storybook/react";
import UploadFile from "./UploadFile";

const meta: Meta<typeof UploadFile> = {
  component: UploadFile,
  title: "Components/UploadFile",
  parameters: {
    docs: {
      description: {
        component:
          "A reusable drag-and-drop CSV file uploader built with `react-papaparse`. Supports drag, progress, and removal.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UploadFile>;

export const Default: Story = {
  args: {},
};

export const WithCustomContainer: Story = {
  render: () => (
    <div
      style={{
        width: "400px",
        height: "200px",
        margin: "40px auto",
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <UploadFile />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Example showing the `UploadFile` component inside a custom bordered container.",
      },
    },
  },
};
