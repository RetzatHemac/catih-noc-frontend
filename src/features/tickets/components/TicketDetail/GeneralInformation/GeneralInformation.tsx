import { EditableField } from "../../../../../components/patterns/EditableField/EditableField";

import {
  assignedToOptions,
  categoryOptions,
  problemTypeOptions,
  siteOptions,
  ticketTypeOptions,
} from "../../../config/ticketDetailOptions";

import type { TicketDetail } from "../../../types/ticketDetail.types";

import styles from "./GeneralInformation.module.css";

const STATUS_LABELS: Record<TicketDetail["status"], string> = {
  CREADO: "Creado",
  ASIGNADO: "Asignado",
  EN_PROCESO: "En proceso",
  PAUSADO: "Pausado",
  CERRADO: "Cerrado",
  COTIZACION: "Cotización",
  RESUELTO: "Resuelto",
};

const dateTimeFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value.replace(" ", "T"));

  return Number.isNaN(date.getTime()) ? value : dateTimeFormatter.format(date);
}

export type GeneralInformationField =
  | "site.name"
  | "site.municipality"
  | "site.address"
  | "site.latitude"
  | "site.longitude"
  | "category"
  | "problemType"
  | "ticketType"
  | "assignedTo"
  | "resolvedAt";

interface GeneralInformationProps {
  ticket: TicketDetail;
  canEditTicket?: boolean;
  canEditSite?: boolean;
  canChangeSiteAddress?: boolean;
  onUpdate: (field: GeneralInformationField, value: string) => void;
}

export function GeneralInformation({
  ticket,
  canEditTicket = false,
  canEditSite = false,
  canChangeSiteAddress = false,
  onUpdate,
}: GeneralInformationProps) {
  return (
    <div className={styles.groups}>
      <section className={styles.group} aria-labelledby="ticket-data-title">
        <h3 id="ticket-data-title" className={styles.groupTitle}>
          Datos del ticket
        </h3>

        <div className={styles.groupGrid}>
          <EditableField
            label="Estatus"
            value={ticket.status}
            displayValue={
              <span className={styles.status} data-status={ticket.status}>
                {STATUS_LABELS[ticket.status]}
              </span>
            }
          />

          <EditableField
            label="Categoría"
            value={ticket.category}
            editable={canEditTicket}
            control="select"
            options={categoryOptions}
            onSave={(value) => onUpdate("category", value)}
          />

          <EditableField
            label="Tipo de problema"
            value={ticket.problemType}
            editable={canEditTicket}
            control="select"
            options={problemTypeOptions}
            onSave={(value) => onUpdate("problemType", value)}
          />

          <EditableField
            label="Tipo de ticket"
            value={ticket.ticketType}
            editable={canEditTicket}
            control="select"
            options={ticketTypeOptions}
            onSave={(value) => onUpdate("ticketType", value)}
          />
        </div>
      </section>

      <section className={styles.group} aria-labelledby="site-data-title">
        <h3 id="site-data-title" className={styles.groupTitle}>
          Sitio
        </h3>

        <div className={styles.groupGrid}>
          <EditableField
            label="Sitio"
            value={ticket.site.name}
            editable={canEditSite}
            control="select"
            options={siteOptions}
            onSave={(value) => onUpdate("site.name", value)}
          />

          <EditableField
            label="Municipio"
            value={ticket.site.municipality}
            editable={canEditSite}
            onSave={(value) => onUpdate("site.municipality", value)}
          />

          <div className={styles.wideField}>
            <EditableField
              label="Dirección"
              value={ticket.site.address}
              editable={canChangeSiteAddress}
              onSave={(value) => onUpdate("site.address", value)}
            />
          </div>

          <EditableField
            label="Latitud"
            value={ticket.site.latitude}
            editable={canEditSite}
            control="number"
            onSave={(value) => onUpdate("site.latitude", value)}
          />

          <EditableField
            label="Longitud"
            value={ticket.site.longitude}
            editable={canEditSite}
            control="number"
            onSave={(value) => onUpdate("site.longitude", value)}
          />
        </div>
      </section>

      <section className={styles.group} aria-labelledby="assignment-data-title">
        <h3 id="assignment-data-title" className={styles.groupTitle}>
          Asignación
        </h3>

        <div className={styles.groupGrid}>
          <EditableField
            label="Asignado a"
            value={ticket.assignedTo}
            editable={canEditTicket}
            control="select"
            options={assignedToOptions}
            onSave={(value) => onUpdate("assignedTo", value)}
          />

          <EditableField label="Proveedor asignado" value={ticket.provider} />

          <div className={styles.wideField}>
            <EditableField
              label="Dependencia"
              value={ticket.dependencies?.[0]}
            />
          </div>
        </div>
      </section>

      <section className={styles.group} aria-labelledby="tracking-data-title">
        <h3 id="tracking-data-title" className={styles.groupTitle}>
          Seguimiento
        </h3>

        <div className={styles.groupGrid}>
          <EditableField
            label="Fecha de creación"
            value={ticket.createdAt}
            displayValue={formatDateTime(ticket.createdAt)}
          />

          <EditableField
            label="Fecha de agenda"
            value={ticket.scheduledAt}
            displayValue={formatDateTime(ticket.scheduledAt)}
          />

          <EditableField
            label="Fecha de resolución"
            value={ticket.resolvedAt}
            displayValue={formatDateTime(ticket.resolvedAt)}
            editable={canEditTicket}
            control="datetime-local"
            onSave={(value) => onUpdate("resolvedAt", value)}
          />

          <EditableField
            label="Fecha de cierre"
            value={ticket.closedAt}
            displayValue={formatDateTime(ticket.closedAt)}
          />

          <div className={styles.wideField}>
            <EditableField
              label="Tiempo de resolución"
              value={ticket.resolutionTime}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
