import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import MultiSelectInput from "./multiSelect";

const meta: Meta<typeof MultiSelectInput> = {
  component: MultiSelectInput,
  title: "Components/MultiSelectInput",
};

export default meta;
type Story = StoryObj<typeof MultiSelectInput>;

// A wrapper that manages state for Storybook
const StatefulWrapper = (args: any) => {
  const [value, setValue] = useState(args.value);

  return (
    <MultiSelectInput
      {...args}
      value={value}
      placeholder="Select..."
      onChange={(val) => setValue(val)} // ✅ direct value now
    />
  );
};

export const StringOptions: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      value={[]} // initial state
      options={["France", "Italy", "Spain", "Germany"]}
    />
  ),
};

export const ObjectOptions: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      value={[]} // initial state
      options={[
        { id: "luxury", label: "Luxury" },
        { id: "budget", label: "Budget" },
        { id: "family", label: "Family" },
        { id: "adventure", label: "Adventure" },
      ]}
    />
  ),
};
