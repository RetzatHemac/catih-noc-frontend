import { useState } from "react";

import { Modal } from "../../../../../components/ui/Modal/Modal";
import { Button } from "../../../../../components/ui/Button/Button";
import { StatusMessage } from "../../../../../components/ui/StatusMessage/StatusMessage";
import type { TicketDetail } from "../../../types/ticketDetail.types";

import styles from "./CopyAuxiliaryTextModal.module.css";

interface CopyAuxiliaryTextModalProps {
  open: boolean;
  ticket: TicketDetail;
  onClose: () => void;
  onCopied?: () => void;
}

export function CopyAuxiliaryTextModal({
  open,
  ticket,
  onClose,
  onCopied,
}: CopyAuxiliaryTextModalProps) {
  const [copyError, setCopyError] = useState<string | null>(null);
  const auxiliaryText = `Ticket: ${ticket.identifier}
Sitio: ${ticket.site.name}
Categoría: ${ticket.category}
Estado: ${ticket.status}
Descripción: ${ticket.description}`;

  const handleCopy = async () => {
    try {
      setCopyError(null);
      await navigator.clipboard.writeText(auxiliaryText);
      onClose();
      onCopied?.();
    } catch {
      setCopyError(
        "No se pudo copiar la información. Revisa los permisos del navegador e intenta nuevamente.",
      );
    }
  };

  const footer = (
    <div className={styles.footer}>
      <Button variant="secondary" onClick={onClose}>
        Cancelar
      </Button>
      <Button variant="primary" onClick={handleCopy}>
        Copiar
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Información auxiliar del ticket"
      footer={footer}
      size="md"
      closeOnOverlayClick={true}
    >
      <pre className={styles.content}>{auxiliaryText}</pre>
      {copyError && <StatusMessage tone="error">{copyError}</StatusMessage>}
    </Modal>
  );
}
