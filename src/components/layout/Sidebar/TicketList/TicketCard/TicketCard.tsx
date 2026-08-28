import { Clock3, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { TICKET_STATUS_CONFIG } from "../../../../../features/tickets/config/ticketStatus";
import type { Ticket } from "../../../../../features/tickets/types/tickets.types";

import styles from "./TicketCard.module.css";

interface TicketCardProps {
  ticket: Ticket;
  selected: boolean;
  onSelect: (ticket: Ticket) => void;
}

export function TicketCard({ ticket, selected, onSelect }: TicketCardProps) {
  const navigate = useNavigate();
  const status = TICKET_STATUS_CONFIG[ticket.status];

  const handleClick = () => {
    onSelect(ticket);
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      style={
        {
          "--ticket-status": status.color,
          "--ticket-status-soft": status.softColor,
        } as React.CSSProperties
      }
      onClick={handleClick}
    >
      <div className={styles.topRow}>
        <div className={styles.identifier}>
          <span className={styles.statusDot} />
          <span className={styles.id}>{ticket.id}</span>
        </div>

        <div className={styles.sla}>
          <SlaIcon type="response" status={ticket.slaResponse} />

          <SlaIcon type="resolution" status={ticket.slaResolution} />
        </div>
      </div>

      <span className={styles.status}>{status.label}</span>

      <div className={styles.metadata}>
        <span>
          <strong>Helix</strong>
          {ticket.helixId}
        </span>

        <span>
          <strong>Sitio</strong>
          {ticket.site}
        </span>

        <span>
          <strong>Categoría</strong>
          {ticket.category}
        </span>

        <span>
          <strong>Atendido por</strong>
          {ticket.attendedBy}
        </span>
      </div>
    </button>
  );
}

interface SlaIconProps {
  type: "response" | "resolution";
  status: "ok" | "warning" | "danger";
}

function SlaIcon({ type, status }: SlaIconProps) {
  const Icon = type === "response" ? Clock3 : Timer;

  return (
    <span
      className={styles.slaIcon}
      data-sla={status}
      title={type === "response" ? "SLA respuesta" : "SLA resolución"}
    >
      <Icon size={15} aria-hidden="true" />
    </span>
  );
}
