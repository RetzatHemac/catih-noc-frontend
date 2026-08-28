import { ArrowUpRight, Link2 } from "lucide-react";
import { Link } from "react-router-dom";

import type { RelatedTicket } from "../../../types/ticketDetail.types";

import styles from "./RelatedTickets.module.css";

interface RelatedTicketsProps {
  tickets: RelatedTicket[];
}

export function RelatedTickets({ tickets }: RelatedTicketsProps) {
  if (tickets.length === 0) {
    return <div className={styles.empty}>No hay tickets relacionados.</div>;
  }

  return (
    <div className={styles.list}>
      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          to={`/tickets/${ticket.identifier}`}
          className={styles.item}
        >
          <div className={styles.icon}>
            <Link2 size={17} aria-hidden="true" />
          </div>

          <div className={styles.content}>
            <span className={styles.identifier}>{ticket.identifier}</span>

            <div className={styles.meta}>
              <span>{ticket.problemType}</span>

              <span className={styles.separator} aria-hidden="true">
                ·
              </span>

              <span>{ticket.category}</span>
            </div>
          </div>

          <ArrowUpRight className={styles.arrow} size={17} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}
