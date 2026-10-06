import type { Ref } from "react";
import type { Ticket } from "../../../../features/tickets/types/tickets.types";

import { TicketCard } from "./TicketCard/TicketCard";

import styles from "./TicketList.module.css";
import { useAuth } from "../../../../auth";
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
  const { user, loading, isAuthenticated } = useAuth();
  const permissions = user?.permissions ?? [];
  if (loading) {
    return <div>Cargando sesión...</div>;
  }
  return (
    <section className={styles.list}>
          <div>
      <h1>CATIH</h1>
      <p>Autenticado: {isAuthenticated ? "Sí" : "No"}</p>
      <p> Usuario: {user?.name} </p>
      <p> Rol: {user?.role} </p>
      <p> Clasificación: {user?.classification_code} </p>
      <pre> {JSON.stringify(permissions, null, 2)} </pre>
    </div>
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
