import { X } from "lucide-react";
import {
  FC,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  memo,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";

import "./ModalComponent.scss";

interface ModalComponentProps {
  modalIsOpen: boolean;
  /** Fired once when the modal transitions from closed to open. */
  afterOpenModal?: () => void;
  title?: string;
  customTitle?: ReactNode;
  closeModal: () => void;
  height?: string;
  width?: string;
  content?: ReactNode;
  zIndex?: number | string;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
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
  zIndex = 1000,
  closeOnEscape = true,
  closeOnOverlayClick = true,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  // SSR guard — no portal target on the server.
  const canRender = typeof document !== "undefined";

  // Side effects when open state changes.
  useEffect(() => {
    if (!modalIsOpen) {
      if (wasOpen.current) {
        // Just closed — release scroll lock and restore focus.
        document.body.classList.remove("tat-modal-open");
        previouslyFocused.current?.focus?.();
        wasOpen.current = false;
      }
      return;
    }

    // Just opened — capture focus origin, lock scroll, move focus into dialog.
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.classList.add("tat-modal-open");
    // Defer to next microtask so the dialog is in the DOM.
    requestAnimationFrame(() => dialogRef.current?.focus());

    afterOpenModal?.();
    wasOpen.current = true;
    // afterOpenModal intentionally omitted from deps to mirror the prior
    // react-modal behaviour (fires once per open transition, not on identity changes).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalIsOpen]);

  // ESC to close.
  useEffect(() => {
    if (!modalIsOpen || !closeOnEscape) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalIsOpen, closeOnEscape, closeModal]);

  // Cleanup if the component unmounts while still open.
  useEffect(
    () => () => {
      document.body.classList.remove("tat-modal-open");
    },
    [],
  );

  if (!modalIsOpen || !canRender) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) closeModal();
  };

  const handleDialogClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    // Don't let clicks inside the dialog bubble up and close the modal.
    e.stopPropagation();
  };

  const handleDialogKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    // Keep keyboard events scoped to the dialog (e.g. Esc handled at document
    // level still works, but other shortcuts don't leak to underlying app).
    e.stopPropagation();
  };

  return createPortal(
    <div
      className="tat-modal-overlay"
      style={{ zIndex }}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="tat-modal-dialog"
        style={{ width, height }}
        role="dialog"
        aria-modal="true"
        aria-label={title || undefined}
        tabIndex={-1}
        onClick={handleDialogClick}
        onKeyDown={handleDialogKeyDown}
      >
        <div className="tat-modal-content">
          <div className="tat-modal-header">
            {customTitle ? (
              customTitle
            ) : (
              <h3 className="tat-modal-title">{title}</h3>
            )}
            <button
              type="button"
              className="tat-modal-close"
              aria-label="Close dialog"
              onClick={closeModal}
            >
              <X aria-hidden />
            </button>
          </div>
          <div className="tat-modal-body">{content}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default memo(ModalComponent);
