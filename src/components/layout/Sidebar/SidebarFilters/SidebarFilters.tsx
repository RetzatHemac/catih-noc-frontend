import { ChevronDown, RotateCcw } from "lucide-react";
import { useState } from "react";

import styles from "./SidebarFilters.module.css";

const statuses = [
  { id: "created", label: "Creado" },
  { id: "assigned", label: "Asignado" },
  { id: "in-progress", label: "En proceso" },
  { id: "paused", label: "Pausado" },
  { id: "closed", label: "Cerrado" },
  { id: "quotation", label: "Cotización" },
  { id: "resolved", label: "Resuelto" },
];

export function SidebarFilters() {
  const [expanded, setExpanded] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((item) => item !== status)
        : [...current, status],
    );
  };

  return (
    <section className={styles.filters}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        <span>
          Filtros
          {selectedStatuses.length > 0 && (
            <small>{selectedStatuses.length}</small>
          )}
        </span>

        <ChevronDown
          size={18}
          className={expanded ? styles.expanded : ""}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div className={styles.content}>
          <fieldset className={styles.fieldset}>
            <legend>Estatus</legend>

            <div className={styles.statusGrid}>
              {statuses.map((status) => {
                const selected = selectedStatuses.includes(status.id);

                return (
                  <button
                    key={status.id}
                    type="button"
                    className={`${styles.statusButton} ${
                      selected ? styles.selected : ""
                    }`}
                    data-status={status.id}
                    aria-pressed={selected}
                    onClick={() => toggleStatus(status.id)}
                  >
                    <span className={styles.statusDot} />
                    {status.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className={styles.field}>
            <span>Supervisor</span>
            <select defaultValue="">
              <option value="">Todos</option>
              <option value="supervisor-1">Supervisor 1</option>
              <option value="supervisor-2">Supervisor 2</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Usuario</span>
            <select defaultValue="">
              <option value="">Todos</option>
              <option value="user-1">Usuario 1</option>
              <option value="user-2">Usuario 2</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Proyecto</span>
            <select defaultValue="">
              <option value="">Todos</option>
              <option value="3k">Proyecto 3K</option>
              <option value="wifi-mundial">WiFi Mundial</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Tipo</span>
            <select defaultValue="">
              <option value="">Todos</option>
              <option value="incident">Incidente</option>
              <option value="request">Solicitud</option>
            </select>
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton}>
              <RotateCcw size={15} />
              Restablecer
            </button>

            <button type="button" className={styles.secondaryButton}>
              Ver mapa
            </button>

            <button type="button" className={styles.secondaryButton}>
              Reporte supervisor
            </button>

            <button type="button" className={styles.secondaryButton}>
              Reporte filtrado
            </button>

            <button type="button" className={styles.secondaryButton}>
              Ver todos
            </button>

            <button type="button" className={styles.secondaryButton}>
              Reporte asignado
            </button>

            <button type="button" className={styles.secondaryButton}>
              Mostrar mapa
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
