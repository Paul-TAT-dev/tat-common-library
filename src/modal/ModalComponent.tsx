import { X } from "lucide-react";
import { FC, memo, ReactNode } from "react";
import Modal from "react-modal";

import "./ModalComponent.scss";

interface ModalComponentProps {
  modalIsOpen: boolean;
  afterOpenModal?: Modal.OnAfterOpenCallback;
  title?: string;
  customTitle?: ReactNode;
  closeModal: () => void;
  height?: string;
  width?: string;
  content?: ReactNode;
  zIndex?: string;
}

const ModalComponent: FC<ModalComponentProps> = ({
  modalIsOpen,
  afterOpenModal,
  title = "",
  customTitle,
  closeModal,
  height = "90%",
  width = "90%",
  content,
  zIndex = 2,
}) => {
  const customStyles = {
    overlay: {
      zIndex,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width,
      height,
      padding: "20px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
  };
  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      contentLabel={title}
      style={customStyles}
      bodyOpenClassName="tat-modal-open"
    >
      <div className="tat-modal-content">
        <div className="tat-modal-header">
          {customTitle ? customTitle : <h3 className="tat-modal-title">{title}</h3>}
          <span className="tat-modal-close">
            <X onClick={closeModal} />
          </span>
        </div>
        <div className="tat-modal-body">{content}</div>
      </div>
    </Modal>
  );
};

export default memo(ModalComponent);
