import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./ConfirmModal.css";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "success" | "info";
}

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "info",
}: ConfirmModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="custom-modal-overlay" onClick={onCancel}>
      <div
        className={`custom-modal-content glass-panel ${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="custom-modal-header">
          <h3 className="custom-modal-title">{title}</h3>
        </div>
        <p className="custom-modal-message">{message}</p>
        <div className="custom-modal-actions">
          <button className="custom-modal-btn btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`custom-modal-btn btn-confirm-${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmModal;
