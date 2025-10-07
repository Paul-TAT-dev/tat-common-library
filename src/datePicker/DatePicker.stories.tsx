import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DatePicker from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: "Components/DatePicker",
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

// Wrapper for managing state in Storybook
const StatefulWrapper = (args: any) => {
  const [value, setValue] = useState(args.value);

  return (
    <DatePicker
      {...args}
      value={value}
      onChange={(val: string) => setValue(val)}
    />
  );
};

export const Default: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      id="defaultDate"
      label="Select Date"
      value=""
      placeholder="Pick a date"
      required={true}
    />
  ),
};

export const WithFormat: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      id="formattedDate"
      label="Formatted Date"
      value=""
      format="MM/dd/yyyy"
      placeholder="MM/DD/YYYY"
    />
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      id="disabledDate"
      label="Disabled Date Picker"
      value="2025-09-26"
      disabled
    />
  ),
};
