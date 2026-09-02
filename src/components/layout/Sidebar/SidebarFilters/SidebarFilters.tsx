import { ChevronDown, RotateCcw } from "lucide-react";
import { useState } from "react";

import { Button } from "../../../ui/Button/Button";
import { Select } from "../../../ui/Select/Select";
import type {
  TicketFilters,
  TicketStatus,
} from "../../../../features/tickets/types/tickets.types";
import { countActiveTicketFilters } from "../../../../features/tickets/utils/ticketFilters";

import styles from "./SidebarFilters.module.css";

const statuses: { id: TicketStatus; label: string }[] = [
  { id: "created", label: "Creado" },
  { id: "assigned", label: "Asignado" },
  { id: "in-progress", label: "En proceso" },
  { id: "paused", label: "Pausado" },
  { id: "closed", label: "Cerrado" },
  { id: "quotation", label: "Cotización" },
  { id: "resolved", label: "Resuelto" },
];

const supervisorOptions = [
  { value: "supervisor-1", label: "Supervisor 1" },
  { value: "supervisor-2", label: "Supervisor 2" },
];

const userOptions = [
  { value: "user-1", label: "Usuario 1" },
  { value: "user-2", label: "Usuario 2" },
];

const projectOptions = [
  { value: "3k", label: "Proyecto 3K" },
  { value: "wifi-mundial", label: "WiFi Mundial" },
];

const typeOptions = [
  { value: "incident", label: "Incidente" },
  { value: "request", label: "Solicitud" },
];

interface SidebarFiltersProps {
  filters: TicketFilters;
  onChange: (patch: Partial<TicketFilters>) => void;
  onReset: () => void;
}

export function SidebarFilters({
  filters,
  onChange,
  onReset,
}: SidebarFiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = countActiveTicketFilters(filters);
  const activeLabels = getActiveFilterLabels(filters);
  const visibleSummary = activeLabels.slice(0, 2).join(" · ");
  const remainingSummaryCount = activeLabels.length - 2;

  function toggleStatus(status: TicketStatus) {
    onChange({
      statuses: filters.statuses.includes(status)
        ? filters.statuses.filter((item) => item !== status)
        : [...filters.statuses, status],
    });
  }

  return (
    <section className={styles.filters}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        aria-controls="sidebar-filter-content"
      >
        <span className={styles.headerText}>
          <span className={styles.headerTitle}>
            Filtros
            {activeCount > 0 && <small>{activeCount}</small>}
          </span>

          {!expanded && visibleSummary && (
            <span className={styles.summary}>
              {visibleSummary}
              {remainingSummaryCount > 0 && ` · +${remainingSummaryCount}`}
            </span>
          )}
        </span>

        <ChevronDown
          size={18}
          className={expanded ? styles.expanded : ""}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div id="sidebar-filter-content" className={styles.content}>
          <fieldset className={styles.fieldset}>
            <legend>Estatus</legend>

            <div className={styles.statusGrid}>
              {statuses.map((status) => {
                const selected = filters.statuses.includes(status.id);

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

          <div className={styles.selectGrid}>
            <label className={styles.field} htmlFor="filter-project">
              <span>Proyecto</span>
              <Select
                id="filter-project"
                value={filters.project}
                options={projectOptions}
                placeholder="Todos"
                onChange={(event) =>
                  onChange({
                    project: event.target.value as TicketFilters["project"],
                  })
                }
              />
            </label>

            <label className={styles.field} htmlFor="filter-type">
              <span>Tipo</span>
              <Select
                id="filter-type"
                value={filters.type}
                options={typeOptions}
                placeholder="Todos"
                onChange={(event) =>
                  onChange({
                    type: event.target.value as TicketFilters["type"],
                  })
                }
              />
            </label>

            <label className={styles.field} htmlFor="filter-supervisor">
              <span>Supervisor</span>
              <Select
                id="filter-supervisor"
                value={filters.supervisor}
                options={supervisorOptions}
                placeholder="Todos"
                onChange={(event) =>
                  onChange({ supervisor: event.target.value })
                }
              />
            </label>

            <label className={styles.field} htmlFor="filter-user">
              <span>Usuario</span>
              <Select
                id="filter-user"
                value={filters.user}
                options={userOptions}
                placeholder="Todos"
                onChange={(event) => onChange({ user: event.target.value })}
              />
            </label>
          </div>

          <div className={styles.footer}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              disabled={activeCount === 0}
            >
              <RotateCcw size={15} aria-hidden="true" />
              Restablecer filtros
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function getActiveFilterLabels(filters: TicketFilters): string[] {
  return [
    ...statuses
      .filter((status) => filters.statuses.includes(status.id))
      .map((status) => status.label),
    getSelectedLabel(projectOptions, filters.project),
    getSelectedLabel(typeOptions, filters.type),
    getSelectedLabel(supervisorOptions, filters.supervisor),
    getSelectedLabel(userOptions, filters.user),
  ].filter((label): label is string => Boolean(label));
}

function getSelectedLabel(
  options: { value: string; label: string }[],
  value: string,
): string | undefined {
  return options.find((option) => option.value === value)?.label;
}
