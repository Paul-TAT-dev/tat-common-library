import { Meta, StoryObj } from "@storybook/react";
import ModalComponent from "./ModalComponent";

const meta: Meta<typeof ModalComponent> = {
  component: ModalComponent,
  title: "Components/ModalComponent",
};

export default meta;
type Story = StoryObj<typeof ModalComponent>;

export const Default: Story = {
  args: {
    modalIsOpen: true,
    afterOpenModal: () => {},
    title: "ModalComponent title",
    closeModal: () => {},
    height: "50%",
    width: "50%",
    content: <>content: Hello world</>,
  },
};
