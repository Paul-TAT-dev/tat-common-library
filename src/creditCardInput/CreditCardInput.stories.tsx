import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import CreditCardInput, { CreditCardData } from "./CreditCardInput";

const meta: Meta<typeof CreditCardInput> = {
  component: CreditCardInput,
  title: "Components/CreditCardInput",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof CreditCardInput>;

const onChange = (data: CreditCardData) => console.log("Card Data:", data);

/** Default empty input */
export const Default: Story = {
  args: {
    id: "credit-card-default",
    label: "Credit Card Information",
    onChange,
  },
};

export const NoCVC: Story = {
  args: {
    id: "credit-card-no-cvc",
    label: "Credit Card (No CVC)",
    showCVC: false,
    value: {
      name: "John Doe",
      number: "4111111111111111",
      expiry: "12/28",
    },
    onChange: (data) => console.log("No CVC Data:", data),
  },
};

/** Visa */
export const Visa: Story = {
  args: {
    id: "visa-card",
    label: "Visa",
    value: {
      name: "John Doe",
      number: "4111111111111111",
      expiry: "12/28",
      cvc: "123",
    },
    onChange,
  },
};

/** MasterCard */
export const MasterCard: Story = {
  args: {
    id: "mastercard-card",
    label: "MasterCard",
    value: {
      name: "Jane Smith",
      number: "5555555555554444",
      expiry: "09/27",
      cvc: "456",
    },
    onChange,
  },
};

/** American Express */
export const AmericanExpress: Story = {
  args: {
    id: "amex-card",
    label: "American Express",
    value: {
      name: "Alex Johnson",
      number: "378282246310005",
      expiry: "03/29",
      cvc: "1234",
    },
    onChange,
  },
};

/** Discover */
export const Discover: Story = {
  args: {
    id: "discover-card",
    label: "Discover",
    value: {
      name: "Mark Lee",
      number: "6011111111111117",
      expiry: "08/30",
      cvc: "321",
    },
    onChange,
  },
};

/** Diners Club */
export const DinersClub: Story = {
  args: {
    id: "diners-card",
    label: "Diners Club",
    value: {
      name: "Emma White",
      number: "3056930009020004",
      expiry: "05/27",
      cvc: "333",
    },
    onChange,
  },
};

/** JCB */
export const JCB: Story = {
  args: {
    id: "jcb-card",
    label: "JCB",
    value: {
      name: "Ken Tanaka",
      number: "3530111333300000",
      expiry: "11/29",
      cvc: "444",
    },
    onChange,
  },
};

/** Maestro */
export const Maestro: Story = {
  args: {
    id: "maestro-card",
    label: "Maestro",
    value: {
      name: "Sara Lopez",
      number: "6304987654321234",
      expiry: "06/29",
      cvc: "222",
    },
    onChange,
  },
};

/** Laser */
export const Laser: Story = {
  args: {
    id: "laser-card",
    label: "Laser",
    value: {
      name: "Michael Green",
      number: "6771890000000000",
      expiry: "10/30",
      cvc: "555",
    },
    onChange,
  },
};

/** InstaPayment */
export const InstaPayment: Story = {
  args: {
    id: "insta-card",
    label: "InstaPayment",
    value: {
      name: "Rachel Brown",
      number: "6370000000000000",
      expiry: "07/29",
      cvc: "666",
    },
    onChange,
  },
};

/** 🧩 Combined Example: all types previewed */
export const AllCards: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "2rem", width: "400px" }}>
      <CreditCardInput
        id="visa"
        label="Visa"
        value={{
          name: "John Doe",
          number: "4111111111111111",
          expiry: "12/28",
          cvc: "123",
        }}
        onChange={onChange}
      />
      <CreditCardInput
        id="mastercard"
        label="MasterCard"
        value={{
          name: "Jane Smith",
          number: "5555555555554444",
          expiry: "09/27",
          cvc: "456",
        }}
        onChange={onChange}
      />
      <CreditCardInput
        id="amex"
        label="American Express"
        value={{
          name: "Alex Johnson",
          number: "378282246310005",
          expiry: "03/29",
          cvc: "1234",
        }}
        onChange={onChange}
      />
    </div>
  ),
};
