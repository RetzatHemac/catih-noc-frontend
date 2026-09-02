import { useState } from "react";

import type { Ticket } from "../../../../features/tickets/types/tickets.types";

import { TicketCard } from "./TicketCard/TicketCard";

import styles from "./TicketList.module.css";

interface TicketListProps {
  tickets: Ticket[];
  totalCount: number;
}

export function TicketList({ tickets, totalCount }: TicketListProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket.id);
  };

  return (
    <section className={styles.list} aria-label="Tickets">
      <div className={styles.heading}>
        <div>
          <span className={styles.label}>Tickets</span>
          <span
            className={styles.count}
            aria-label={`${tickets.length} tickets`}
          >
            {tickets.length}
          </span>
          {tickets.length !== totalCount && (
            <span className={styles.total}>de {totalCount}</span>
          )}
        </div>
      </div>

      <div className={styles.cards}>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              selected={ticket.id === selectedTicket}
              onSelect={handleSelectTicket}
            />
          ))
        ) : (
          <div className={styles.empty}>
            <strong>Sin resultados</strong>
            <span>No hay tickets que coincidan con los filtros.</span>
          </div>
        )}
      </div>
    </section>
  );
}
