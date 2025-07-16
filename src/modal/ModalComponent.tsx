import { X } from 'lucide-react';
import { FC, memo, ReactNode } from 'react';
import Modal from 'react-modal';

import './ModalComponent.css';

interface ModalComponentProps {
  modalIsOpen: boolean;
  afterOpenModal?: Modal.OnAfterOpenCallback;
  title?: string;
  closeModal: () => void;
  height?: string;
  width?: string;
  content?: ReactNode;
}

const ModalComponent: FC<ModalComponentProps> = ({
  modalIsOpen,
  afterOpenModal,
  title = '',
  closeModal,
  height = '90%',
  width = '90%',
  content
}) => {
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width,
      height,
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }
  };
  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      contentLabel={title}
      style={customStyles}
      bodyOpenClassName="modal-open"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <span className="close">
            <X onClick={closeModal} />
          </span>
        </div>
        <div className="modal-body">{content}</div>
      </div>
    </Modal>
  );
};

export default memo(ModalComponent);
