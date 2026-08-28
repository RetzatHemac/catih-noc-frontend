import { Trash2 } from "lucide-react";

import {
  DataTable,
  type DataTableColumn,
} from "../../../../../components/patterns/DataTable/DataTable";

import { Button } from "../../../../../components/ui/Button/Button";

import type { IntervenedEquipment } from "../../../types/ticketDetail.types";

import styles from "./IntervenedEquipmentTable.module.css";

interface IntervenedEquipmentTableProps {
  equipment: IntervenedEquipment[];
  onDelete: (equipmentId: string) => void;
}

const columns: DataTableColumn<IntervenedEquipment>[] = [
  {
    key: "brand",
    header: "Marca equipo intervenido",
    mobileLabel: "Marca",
    render: (item) => item.brand,
  },
  {
    key: "model",
    header: "Modelo equipo intervenido",
    mobileLabel: "Modelo",
    render: (item) => item.model,
  },
  {
    key: "serial",
    header: "Serie equipo intervenido",
    mobileLabel: "Serie",
    render: (item) => item.serial,
  },
  {
    key: "observations",
    header: "Observaciones",
    render: (item) => item.observations || "Sin observaciones",
  },
];

export function IntervenedEquipmentTable({
  equipment,
  onDelete,
}: IntervenedEquipmentTableProps) {
  return (
    <DataTable
      data={equipment}
      columns={columns}
      getRowId={(item) => item.id}
      emptyLabel="Sin equipos intervenidos"
      actions={(item) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={styles.deleteButton}
          onClick={() => onDelete(item.id)}
          aria-label="Eliminar equipo intervenido"
          title="Eliminar"
        >
          <Trash2 size={16} aria-hidden="true" />
        </Button>
      )}
    />
  );
}
