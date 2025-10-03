import { Meta, StoryObj } from "@storybook/react";
import Tooltip from "./Tooltip";
import { Info } from "lucide-react";
import React, { useState } from "react";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: "Components/Tooltip",
  argTypes: {
    placement: {
      control: { type: "select" },
      options: ["top", "bottom", "left", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// Default tooltip with simple text info
export const Default: Story = {
  args: {
    id: "tooltip-1",
    info: "This is a simple tooltip message",
    icon: <Info size={18} />,
    placement: "top",
    className: "",
  },
};

// Tooltip with custom JSX content
export const WithCustomInfo: Story = {
  args: {
    id: "tooltip-2",
    customInfo: (
      <div>
        <strong>Custom Tooltip</strong>
        <br />
        With <em>JSX content</em>
      </div>
    ),
    icon: <Info size={18} />,
    placement: "right",
  },
};

// Controllable tooltip example
export const Controllable: Story = {
  render: (args) => {
    const [controlShow, setControlShow] = useState<string>("");

    return (
      <div style={{ padding: "50px" }}>
        <Tooltip
          {...args}
          id="tooltip-3"
          info="I am controlled externally"
          icon={<Info size={18} />}
          isControllable
          controlShow={controlShow === "tooltip-3"}
          setControlShow={setControlShow}
        />
        <button onClick={() => setControlShow("tooltip-3")}>
          Show Tooltip
        </button>
        <button
          onClick={() => setControlShow("")}
          style={{ marginLeft: "10px" }}
        >
          Hide Tooltip
        </button>
      </div>
    );
  },
};
