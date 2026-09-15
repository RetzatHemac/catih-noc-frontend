import { ChevronDown, Wrench } from "lucide-react";
import { useId, useState } from "react";
import { useAuth } from "../../../../auth";
import { getVisibleTicketListTools } from "../../policies/ticketListToolsAccess";
import type { TicketListToolsContext } from "../../types/ticketListTools.types";
import styles from "./TicketListTools.module.css";

interface TicketListToolsProps {
  context: TicketListToolsContext;
}

export function TicketListTools({ context }: TicketListToolsProps) {
  const { user } = useAuth();
  const tools = getVisibleTicketListTools(user);
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const descriptionId = useId();
  const count = context.ticketIds.length;

  if (!tools.length) return null;

  return (
    <div className={styles.tools}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        aria-controls={contentId}
      >
        <span className={styles.icon}>
          <Wrench size={21} aria-hidden="true" />
        </span>
        <span className={styles.heading}>
          Herramientas de tickets
          <small>
            {count} {count === 1 ? "ticket en la lista" : "tickets en la lista"}
          </small>
        </span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={expanded ? styles.expanded : ""}
        />
      </button>
      <div id={contentId} hidden={!expanded} className={styles.content}>
        <p id={descriptionId} className={styles.description}>
          Próximamente. Estas herramientas usarán los resultados de la lista,
          con su búsqueda, bandeja y filtros aplicados.
        </p>
        {context.filters.query.trim() && (
          <p className={styles.query}>
            Búsqueda: <strong>{context.filters.query}</strong>
          </p>
        )}
        {count === 0 && (
          <p className={styles.description}>
            La lista no tiene resultados con los filtros actuales.
          </p>
        )}
        {tools.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={styles.toolButton}
            disabled
            aria-describedby={descriptionId}
            title="Disponible en una fase posterior"
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
