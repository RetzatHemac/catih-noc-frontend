import { Download, Pencil, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { can, PERMISSIONS, useAuth } from "../../../../auth";
import { ConfirmDialog } from "../../../../components/patterns/ConfirmDialog/ConfirmDialog";
import {
  DataTable,
  type DataTableColumn,
} from "../../../../components/patterns/DataTable/DataTable";
import { Pagination } from "../../../../components/patterns/Pagination/Pagination";
import { Button } from "../../../../components/ui/Button/Button";
import { Input } from "../../../../components/ui/Input/Input";
import { Select } from "../../../../components/ui/Select/Select";
import { StatusMessage } from "../../../../components/ui/StatusMessage/StatusMessage";
import { MOCK_TAGGED_EQUIPMENT } from "../../mocks/taggedEquipment.mock";
import type { TaggedEquipment } from "../../types/taggedEquipment.types";
import { downloadTaggingLayout } from "../../utils/downloadTaggingLayout";
import {
  filterTaggedEquipment,
  paginateTaggedEquipment,
} from "../../utils/taggingTable";
import { EquipmentDataDialog } from "../EquipmentDataDialog/EquipmentDataDialog";

import styles from "./TaggingPage.module.css";

type PageSize = 10 | 25 | 50 | 100;

const pageSizeOptions = [10, 25, 50, 100].map((size) => ({
  value: String(size),
  label: `${size} filas`,
}));

export function TaggingPage() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState(MOCK_TAGGED_EQUIPMENT);
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<TaggedEquipment>();
  const [confirmLayout, setConfirmLayout] = useState(false);
  const [feedback, setFeedback] = useState("");
  const canView = can(user, PERMISSIONS.TAGGING_VIEW);
  const canEdit = can(user, PERMISSIONS.TAGGING_EDIT);
  const canGenerateLayout = can(user, PERMISSIONS.TAGGING_VALIDATE);
  const filteredEquipment = useMemo(
    () => filterTaggedEquipment(equipment, query),
    [equipment, query],
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredEquipment.length / pageSize),
  );
  const currentPage = Math.min(page, totalPages);
  const visibleEquipment = useMemo(
    () => paginateTaggedEquipment(filteredEquipment, currentPage, pageSize),
    [currentPage, filteredEquipment, pageSize],
  );

  useEffect(() => {
    if (!feedback) return;
    const timeoutId = window.setTimeout(() => setFeedback(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  if (!canView) {
    return (
      <main className={styles.page}>
        <StatusMessage tone="error">
          No tienes permiso para consultar la tabla de etiquetado.
        </StatusMessage>
      </main>
    );
  }

  const columns: DataTableColumn<TaggedEquipment>[] = [
    {
      key: "fixedAssetId",
      header: "Id activo fijo",
      render: (item) => (
        <strong className={styles.code}>{item.fixedAssetId}</strong>
      ),
    },
    {
      key: "serialNumber",
      header: "Serie",
      render: (item) => (
        <span className={styles.code}>{item.serialNumber}</span>
      ),
    },
    { key: "model", header: "Modelo", render: (item) => item.model },
    { key: "type", header: "Tipo", render: (item) => item.type },
    { key: "site", header: "Sitio", render: (item) => item.site },
    {
      key: "status",
      header: "Estatus",
      render: (item) => (
        <span className={styles.status} data-status={item.status}>
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <main className={styles.page}>
      {feedback && <StatusMessage tone="success">{feedback}</StatusMessage>}

      <section className={styles.panel} aria-label="Tabla de etiquetado">
        <div className={styles.toolbar}>
          <div className={styles.searchField}>
            <Search size={18} aria-hidden="true" />
            <Input
              type="search"
              value={query}
              placeholder="Buscar por nombre, nombre corto o empresa"
              aria-label="Buscar equipos etiquetados"
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <label className={styles.field} htmlFor="tagging-page-size">
            <span>Filas por página</span>
            <Select
              id="tagging-page-size"
              value={String(pageSize)}
              options={pageSizeOptions}
              onChange={(event) => {
                setPageSize(Number(event.target.value) as PageSize);
                setPage(1);
              }}
            />
          </label>

          {canGenerateLayout && (
            <Button variant="secondary" onClick={() => setConfirmLayout(true)}>
              <Download size={18} aria-hidden="true" /> Generar layout
            </Button>
          )}
        </div>

        <div className={styles.resultSummary} role="status">
          {filteredEquipment.length}{" "}
          {filteredEquipment.length === 1 ? "equipo" : "equipos"}
        </div>

        <DataTable
          data={visibleEquipment}
          columns={columns}
          getRowId={(item) => item.id}
          emptyLabel="No hay equipos que coincidan con la búsqueda."
          actions={
            canEdit
              ? (item) => (
                  <div className={styles.rowActions}>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Editar ${item.fixedAssetId}`}
                      title="Editar"
                      onClick={() => setEditing(item)}
                    >
                      <Pencil size={17} aria-hidden="true" />
                    </Button>
                  </div>
                )
              : undefined
          }
        />

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>

      <EquipmentDataDialog
        equipment={editing}
        onClose={() => setEditing(undefined)}
        onSave={(updatedEquipment) => {
          setEquipment((current) =>
            current.map((item) =>
              item.id === updatedEquipment.id ? updatedEquipment : item,
            ),
          );
          setEditing(undefined);
          setFeedback("Datos del equipo actualizados correctamente.");
        }}
      />

      <ConfirmDialog
        open={confirmLayout}
        title="Generar layout"
        description={`Se descargará un archivo de Excel con ${filteredEquipment.length} ${filteredEquipment.length === 1 ? "equipo" : "equipos"}. ¿Deseas continuar?`}
        confirmLabel="Generar y descargar"
        onClose={() => setConfirmLayout(false)}
        onConfirm={() => {
          downloadTaggingLayout(filteredEquipment);
          setConfirmLayout(false);
          setFeedback("Layout generado correctamente.");
        }}
      />
    </main>
  );
}
