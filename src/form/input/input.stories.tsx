import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Input from "./input";

const meta: Meta<typeof Input> = {
  component: Input,
  title: "Components/Input",
};
export default meta;

type Story = StoryObj<typeof Input>;

// Wrapper to manage state for interactive stories
const StatefulWrapper = (args: any) => {
  const [value, setValue] = useState(args.value);

  return <Input {...args} value={value} onChange={(val) => setValue(val)} />;
};

export const Default: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      id="defaultInput"
      label="Default Input"
      placeholder="Type something..."
      value=""
    />
  ),
};

export const Currency: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      id="currencyInput"
      label="Currency Input"
      placeholder="$ 0.00"
      format="currency"
      value=""
    />
  ),
};

export const Phone: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      id="phoneInput"
      label="Phone Number"
      format="phone"
      value=""
    />
  ),
};

export const Email: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      id="emailInput"
      label="Email Address"
      placeholder="example@example.com"
      format="email"
      value=""
    />
  ),
};

export const CreditCard: Story = {
  render: (args) => (
    <StatefulWrapper
      {...args}
      id="creditCardInput"
      label="Credit Card Number"
      placeholder="0000 0000 0000 0000"
      format="creditCard"
      value=""
    />
  ),
};
