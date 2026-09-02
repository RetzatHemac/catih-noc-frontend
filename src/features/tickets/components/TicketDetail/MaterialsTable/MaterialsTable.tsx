import {
  DataTable,
  type DataTableColumn,
} from "../../../../../components/patterns/DataTable/DataTable";

import type { Material } from "../../../types/ticketDetail.types";

import styles from "./MaterialsTable.module.css";

interface MaterialsTableProps {
  materials: Material[];
  canValidate?: boolean;
  onReviewChange: (materialId: string, reviewed: boolean) => void;
}

const columns: DataTableColumn<Material>[] = [
  {
    key: "provider",
    header: "Proveedor",
    render: (item) => item.provider,
  },
  {
    key: "material",
    header: "Material",
    render: (item) => item.material,
  },
  {
    key: "providerQuantity",
    header: "Cantidad proveedor",
    render: (item) => item.providerQuantity,
  },
  {
    key: "supervisorQuantity",
    header: "Cantidad supervisor",
    render: (item) => item.supervisorQuantity,
  },
  {
    key: "unit",
    header: "Unidad",
    render: (item) => item.unit,
  },
  {
    key: "reviewed",
    header: "Revisión",
    render: () => null,
  },
  {
    key: "supervisor",
    header: "Supervisor",
    render: (item) => item.supervisor,
  },
  {
    key: "comment",
    header: "Comentario",
    render: (item) => item.comment || "Sin comentario",
  },
];

export function MaterialsTable({
  materials,
  canValidate = false,
  onReviewChange,
}: MaterialsTableProps) {
  const materialColumns: DataTableColumn<Material>[] = columns.map((column) => {
    if (column.key !== "reviewed") {
      return column;
    }

    return {
      ...column,

      render: (item) => (
        <label className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            checked={item.reviewed}
            disabled={!canValidate}
            onChange={(event) => onReviewChange(item.id, event.target.checked)}
            aria-label={`Revisar ${item.material}`}
          />

          <span>Revisado</span>
        </label>
      ),
    };
  });

  return (
    <DataTable
      data={materials}
      columns={materialColumns}
      getRowId={(item) => item.id}
      emptyLabel="Sin materiales registrados"
    />
  );
}
