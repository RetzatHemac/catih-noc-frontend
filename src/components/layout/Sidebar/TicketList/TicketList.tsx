import { useState } from "react";

import { MOCK_TICKETS } from "../../../../features/tickets/config/mockTickets";
import type { Ticket } from "../../../../features/tickets/types/tickets.types";

import { TicketCard } from "./TicketCard/TicketCard";

import styles from "./TicketList.module.css";

export function TicketList() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket.id);
  };

  return (
    <section className={styles.list} aria-label="Tickets">
      <div className={styles.heading}>
        <div>
          <span className={styles.label}>Tickets</span>
          <span className={styles.count}>{MOCK_TICKETS.length}</span>
        </div>
      </div>

      <div className={styles.cards}>
        {MOCK_TICKETS.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            selected={ticket.id === selectedTicket}
            onSelect={handleSelectTicket}
          />
        ))}
      </div>
    </section>
  );
}
