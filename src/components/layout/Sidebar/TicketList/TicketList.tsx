import type { Ref } from "react";
import type { Ticket } from "../../../../features/tickets/types/tickets.types";

import { TicketCard } from "./TicketCard/TicketCard";

import styles from "./TicketList.module.css";

interface TicketListProps {
  tickets: Ticket[];
  totalCount: number;
  scrollRef?: Ref<HTMLDivElement>;
}

export function TicketList({
  tickets,
  totalCount,
  scrollRef,
}: TicketListProps) {
  return (
    <section className={styles.list}>
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

      <div
        ref={scrollRef}
        className={styles.cards}
        role="region"
        aria-label="Tickets"
        tabIndex={-1}
      >
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
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
