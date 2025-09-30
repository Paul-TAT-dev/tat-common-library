import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import RadioGroup, { OptionObject } from "./radio";

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  title: "Components/RadioGroup",
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

// Wrapper to handle state inside Storybook
const StatefulWrapper = <T extends string | OptionObject>(args: any) => {
  const [value, setValue] = useState<T | null>(args.value);

  return (
    <RadioGroup {...args} value={value} onChange={(val: T) => setValue(val)} />
  );
};

export const StringOptions: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      value={"Male"}
      options={["Male", "Female", "Other"]}
      id="gender"
      name="gender"
      color="#323949"
    />
  ),
};

export const ObjectOptions: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      value={null}
      options={[
        { id: "basic", label: "Basic Plan" },
        { id: "pro", label: "Pro Plan" },
        { id: "enterprise", label: "Enterprise Plan" },
      ]}
      id="plan"
      name="plan"
    />
  ),
};
