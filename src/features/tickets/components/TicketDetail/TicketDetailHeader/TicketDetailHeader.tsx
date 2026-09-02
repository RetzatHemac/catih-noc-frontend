import { Copy, Play, Trash2 } from "lucide-react";

import type { TicketDetail } from "../../../types/ticketDetail.types";

import { Button } from "../../../../../components/ui/Button/Button";

import styles from "./TicketDetailHeader.module.css";

export interface TicketDetailHeaderProps {
  ticket: TicketDetail;
  onCopyAuxiliaryText: () => void;
  canStartTicket?: boolean;
  canDeleteTicket?: boolean;
  onStartTicket?: () => void;
  onDeleteTicket?: () => void;
}

export function TicketDetailHeader({
  ticket,
  onCopyAuxiliaryText,
  canStartTicket = false,
  canDeleteTicket = false,
  onStartTicket,
  onDeleteTicket,
}: TicketDetailHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.main}>
        <div className={styles.heading}>
          <h2 className={styles.title}>
            <span>{ticket.identifier}</span>

            <span className={styles.separator} aria-hidden="true">
              ·
            </span>

            <span>{ticket.site.name}</span>

            <span className={styles.separator} aria-hidden="true">
              ·
            </span>

            <span>{ticket.category}</span>
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={styles.iconButton}
            onClick={onCopyAuxiliaryText}
            aria-label="Mostrar captura auxiliar de texto"
            title="Captura auxiliar de texto"
          >
            <Copy size={18} aria-hidden="true" />
          </Button>
        </div>

        <div className={styles.actions}>
          {canDeleteTicket && onDeleteTicket && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={styles.ticketTypeButton}
              onClick={onDeleteTicket}
              aria-label={`${ticket.ticketType} - Eliminar ticket`}
              title="Eliminar ticket"
            >
              <span>{ticket.ticketType}</span>
              <Trash2 size={16} aria-hidden="true" />
            </Button>
          )}

          {canStartTicket && onStartTicket && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              className={styles.startButton}
              onClick={onStartTicket}
            >
              <Play size={16} aria-hidden="true" />
              <span>Iniciar ticket</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
