import { Modal } from "../../../../../components/ui/Modal/Modal";
import { Button } from "../../../../../components/ui/Button/Button";
import type { TicketDetail } from "../../../types/ticketDetail.types";

import styles from "./CopyAuxiliaryTextModal.module.css";

interface CopyAuxiliaryTextModalProps {
  open: boolean;
  ticket: TicketDetail;
  onClose: () => void;
}

export function CopyAuxiliaryTextModal({
  open,
  ticket,
  onClose,
}: CopyAuxiliaryTextModalProps) {
  const auxiliaryText = `Ticket: ${ticket.identifier}
Sitio: ${ticket.site.name}
Categoría: ${ticket.category}
Estado: ${ticket.status}
Descripción: ${ticket.description}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(auxiliaryText);
      onClose();
    } catch (error) {
      console.error("Error al copiar:", error);
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
    </Modal>
  );
}
