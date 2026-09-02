import { Pencil, Trash2 } from "lucide-react";

import {
  DataTable,
  type DataTableColumn,
} from "../../../../../components/patterns/DataTable/DataTable";

import { Button } from "../../../../../components/ui/Button/Button";

import type { ReplacedEquipment } from "../../../types/ticketDetail.types";

import styles from "./ReplacedEquipmentTable.module.css";

interface ReplacedEquipmentTableProps {
  equipment: ReplacedEquipment[];
  onEdit?: (equipment: ReplacedEquipment) => void;
  onDelete?: (equipmentId: string) => void;
}

const columns: DataTableColumn<ReplacedEquipment>[] = [
  {
    key: "damagedBrand",
    header: "Marca equipo dañado",
    mobileLabel: "Marca dañada",
    render: (item) => item.damagedBrand,
  },
  {
    key: "damagedModel",
    header: "Modelo equipo dañado",
    mobileLabel: "Modelo dañado",
    render: (item) => item.damagedModel,
  },
  {
    key: "damagedSerial",
    header: "Serie equipo dañado",
    mobileLabel: "Serie dañada",
    render: (item) => item.damagedSerial,
  },
  {
    key: "replacementBrand",
    header: "Marca equipo de reemplazo",
    mobileLabel: "Marca reemplazo",
    render: (item) => item.replacementBrand,
  },
  {
    key: "replacementModel",
    header: "Modelo equipo de reemplazo",
    mobileLabel: "Modelo reemplazo",
    render: (item) => item.replacementModel,
  },
  {
    key: "replacementSerial",
    header: "Serie equipo de reemplazo",
    mobileLabel: "Serie reemplazo",
    render: (item) => item.replacementSerial,
  },
  {
    key: "observations",
    header: "Observaciones",
    render: (item) => item.observations || "Sin observaciones",
  },
];

export function ReplacedEquipmentTable({
  equipment,
  onEdit,
  onDelete,
}: ReplacedEquipmentTableProps) {
  return (
    <DataTable
      data={equipment}
      columns={columns}
      getRowId={(item) => item.id}
      emptyLabel="Sin equipos reemplazados"
      actions={
        onEdit || onDelete
          ? (item) => (
              <div className={styles.actions}>
                {onEdit && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(item)}
                    aria-label="Editar equipo reemplazado"
                    title="Editar"
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </Button>
                )}

                {onDelete && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={styles.deleteButton}
                    onClick={() => onDelete(item.id)}
                    aria-label="Eliminar equipo reemplazado"
                    title="Eliminar"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                )}
              </div>
            )
          : undefined
      }
    />
  );
}
