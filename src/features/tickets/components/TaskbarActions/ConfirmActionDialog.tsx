import { Button } from "../../../../components/ui/Button/Button";
import { Modal } from "../../../../components/ui/Modal/Modal";

import styles from "./TaskbarActionModal.module.css";

interface ConfirmActionDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmActionDialog({
  title,
  description,
  confirmLabel,
  danger = false,
  onClose,
  onConfirm,
}: ConfirmActionDialogProps) {
  return (
    <Modal
      open
      title={title}
      onClose={onClose}
      size="sm"
      footer={
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <p>{description}</p>
    </Modal>
  );
}
