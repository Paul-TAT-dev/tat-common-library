import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import TextAreaField from "./textarea";

const meta: Meta<typeof TextAreaField> = {
  component: TextAreaField,
  title: "Components/TextAreaField",
};
export default meta;

type Story = StoryObj<typeof TextAreaField>;

// A wrapper that manages state for Storybook
const StatefulWrapper = (args: any) => {
  const [value, setValue] = useState(args.value);

  return (
    <TextAreaField
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Default: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      id="notes"
      label="Notes"
      value=""
      placeholder="Enter your notes..."
    />
  ),
};

export const Required: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      id="comments"
      label="Comments"
      value=""
      required
      placeholder="This field is required"
    />
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      id="feedback"
      label="Feedback"
      value="Disabled text area"
      disabled
    />
  ),
};
