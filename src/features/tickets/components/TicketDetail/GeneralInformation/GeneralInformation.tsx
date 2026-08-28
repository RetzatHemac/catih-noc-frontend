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
  onUpdate: (field: GeneralInformationField, value: string) => void;
}

export function GeneralInformation({
  ticket,
  onUpdate,
}: GeneralInformationProps) {
  return (
    <div className={styles.grid}>
      <EditableField
        label="Sitio"
        value={ticket.site.name}
        editable
        control="select"
        options={siteOptions}
        onSave={(value) => onUpdate("site.name", value)}
      />

      <EditableField
        label="Municipio"
        value={ticket.site.municipality}
        editable
        onSave={(value) => onUpdate("site.municipality", value)}
      />

      <EditableField
        label="Dirección"
        value={ticket.site.address}
        editable
        onSave={(value) => onUpdate("site.address", value)}
      />

      <EditableField
        label="Latitud"
        value={ticket.site.latitude}
        editable
        control="number"
        onSave={(value) => onUpdate("site.latitude", value)}
      />

      <EditableField
        label="Longitud"
        value={ticket.site.longitude}
        editable
        control="number"
        onSave={(value) => onUpdate("site.longitude", value)}
      />

      <EditableField label="Estatus" value={ticket.status} />

      <EditableField
        label="Categoría"
        value={ticket.category}
        editable
        control="select"
        options={categoryOptions}
        onSave={(value) => onUpdate("category", value)}
      />

      <EditableField
        label="Tipo de problema"
        value={ticket.problemType}
        editable
        control="select"
        options={problemTypeOptions}
        onSave={(value) => onUpdate("problemType", value)}
      />

      <EditableField
        label="Tipo de ticket"
        value={ticket.ticketType}
        editable
        control="select"
        options={ticketTypeOptions}
        onSave={(value) => onUpdate("ticketType", value)}
      />

      <EditableField
        label="Asignado a"
        value={ticket.assignedTo}
        editable
        control="select"
        options={assignedToOptions}
        onSave={(value) => onUpdate("assignedTo", value)}
      />

      <EditableField label="Fecha de creación" value={ticket.createdAt} />

      <EditableField
        label="Fecha de resolución"
        value={ticket.resolvedAt}
        editable
        control="datetime-local"
        onSave={(value) => onUpdate("resolvedAt", value)}
      />

      <EditableField label="Fecha de cierre" value={ticket.closedAt} />

      <EditableField label="Fecha de agenda" value={ticket.scheduledAt} />

      <EditableField label="Proveedor asignado" value={ticket.provider} />

      <EditableField
        label="Tiempo de resolución"
        value={ticket.resolutionTime}
      />

      <EditableField
        label="Dependencias"
        value={
          ticket.dependencies?.length
            ? ticket.dependencies.join(", ")
            : undefined
        }
      />
    </div>
  );
}
