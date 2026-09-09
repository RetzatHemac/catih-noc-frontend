import {
  Download,
  MapPin,
  MoreHorizontal,
  PackageSearch,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
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
import { MOCK_PROJECTS } from "../../../projects/mocks/projects.mock";
import { MOCK_SITES } from "../../mocks/sites.mock";
import type { SiteRecord } from "../../types/site.types";
import { downloadSitesReport } from "../../utils/siteDownloads";
import { filterSites, paginateSites } from "../../utils/siteTable";
import { AddressingDialog } from "../AddressingDialog/AddressingDialog";
import { InventoryDialog } from "../InventoryDialog/InventoryDialog";
import { SiteForm } from "../SiteForm/SiteForm";

import styles from "./SitesPage.module.css";

type PageSize = 10 | 25 | 50 | 100;
type DialogType = "addressing" | "inventory";

const pageSizeOptions = [10, 25, 50, 100].map((size) => ({
  value: String(size),
  label: `${size} filas`,
}));

export function SitesPage() {
  const { user } = useAuth();
  const [sites, setSites] = useState(MOCK_SITES);
  const [projectId, setProjectId] = useState("");
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [page, setPage] = useState(1);
  const [editingSite, setEditingSite] = useState<SiteRecord>();
  const [siteToDelete, setSiteToDelete] = useState<SiteRecord>();
  const [dialog, setDialog] = useState<{
    type: DialogType;
    site: SiteRecord;
  }>();
  const [feedback, setFeedback] = useState("");
  const canView = can(user, PERMISSIONS.SITES_VIEW);
  const canEdit = can(user, PERMISSIONS.SITES_EDIT);
  const canDelete = can(user, PERMISSIONS.SITES_DELETE);
  const filteredSites = useMemo(
    () => filterSites(sites, projectId, query),
    [projectId, query, sites],
  );
  const projectSites = useMemo(
    () => filterSites(sites, projectId, ""),
    [projectId, sites],
  );
  const totalPages = Math.max(1, Math.ceil(filteredSites.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleSites = useMemo(
    () => paginateSites(filteredSites, currentPage, pageSize),
    [currentPage, filteredSites, pageSize],
  );
  const selectedProject = MOCK_PROJECTS.find(
    (project) => project.id === projectId,
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
          No tienes permiso para consultar sitios.
        </StatusMessage>
      </main>
    );
  }

  function updateSite(updatedSite: SiteRecord, message?: string) {
    setSites((current) =>
      current.map((site) => (site.id === updatedSite.id ? updatedSite : site)),
    );
    setDialog((current) =>
      current?.site.id === updatedSite.id
        ? { ...current, site: updatedSite }
        : current,
    );
    if (message) setFeedback(message);
  }

  if (editingSite) {
    return (
      <SiteForm
        site={editingSite}
        onCancel={() => setEditingSite(undefined)}
        onSave={(site) => {
          updateSite(site, "Sitio actualizado correctamente.");
          setEditingSite(undefined);
          setProjectId(site.projectId);
          setPage(1);
        }}
      />
    );
  }

  const columns: DataTableColumn<SiteRecord>[] = [
    {
      key: "code",
      header: "Código",
      render: (site) => <strong className={styles.code}>{site.code}</strong>,
    },
    { key: "latitude", header: "Latitud", render: (site) => site.latitude },
    { key: "longitude", header: "Longitud", render: (site) => site.longitude },
    { key: "address", header: "Dirección", render: (site) => site.address },
    {
      key: "municipality",
      header: "Municipio",
      render: (site) => site.municipality,
    },
    { key: "state", header: "Estado", render: (site) => site.state },
  ];

  return (
    <main className={styles.page}>
      {feedback && <StatusMessage tone="success">{feedback}</StatusMessage>}

      <section className={styles.panel} aria-label="Consulta de sitios">
        <div className={styles.toolbar}>
          <label className={styles.field} htmlFor="sites-project">
            <span>Proyecto</span>
            <Select
              id="sites-project"
              value={projectId}
              options={MOCK_PROJECTS.map((project) => ({
                value: project.id,
                label: project.name,
              }))}
              placeholder="Selecciona un proyecto"
              onChange={(event) => {
                setProjectId(event.target.value);
                setQuery("");
                setPage(1);
              }}
            />
          </label>

          <div className={styles.searchField}>
            <Search size={18} aria-hidden="true" />
            <Input
              type="search"
              value={query}
              placeholder="Buscar por nombre o municipio"
              aria-label="Buscar sitios"
              disabled={!projectId}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <label className={styles.field} htmlFor="sites-page-size">
            <span>Filas por página</span>
            <Select
              id="sites-page-size"
              value={String(pageSize)}
              options={pageSizeOptions}
              disabled={!projectId}
              onChange={(event) => {
                setPageSize(Number(event.target.value) as PageSize);
                setPage(1);
              }}
            />
          </label>

          <Button
            variant="secondary"
            disabled={!selectedProject}
            onClick={() =>
              selectedProject &&
              downloadSitesReport(projectSites, selectedProject.name)
            }
          >
            <Download size={18} aria-hidden="true" /> Descargar sitios
          </Button>
        </div>

        {!projectId ? (
          <div className={styles.projectPrompt}>
            <MapPin size={28} aria-hidden="true" />
            <strong>Selecciona un proyecto</strong>
            <span>
              La tabla mostrará únicamente los sitios del proyecto seleccionado.
            </span>
          </div>
        ) : (
          <>
            <div className={styles.resultSummary} role="status">
              {filteredSites.length}{" "}
              {filteredSites.length === 1 ? "sitio" : "sitios"}
            </div>
            <DataTable
              data={visibleSites}
              columns={columns}
              getRowId={(site) => site.id}
              actionsWidth={152}
              emptyLabel="No hay sitios que coincidan con la búsqueda."
              actions={(site) => (
                <div className={styles.rowActions}>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={styles.editAction}
                      aria-label={`Editar ${site.code}`}
                      title="Editar"
                      onClick={() => setEditingSite(site)}
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={styles.deleteAction}
                      aria-label={`Eliminar ${site.code}`}
                      title="Eliminar"
                      onClick={() => setSiteToDelete(site)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={styles.moreAction}
                    aria-label={`Ver más de ${site.code}`}
                    title="Ver más"
                    onClick={() => setDialog({ type: "addressing", site })}
                  >
                    <MoreHorizontal size={16} aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={styles.inventoryAction}
                    aria-label={`Inventario de ${site.code}`}
                    title="Inventario"
                    onClick={() => setDialog({ type: "inventory", site })}
                  >
                    <PackageSearch size={16} aria-hidden="true" />
                  </Button>
                </div>
              )}
            />
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(siteToDelete)}
        title="Eliminar sitio"
        description={`¿Estás seguro de eliminar el sitio ${siteToDelete?.code ?? "seleccionado"}?`}
        confirmLabel="Eliminar sitio"
        danger
        onClose={() => setSiteToDelete(undefined)}
        onConfirm={() => {
          if (!siteToDelete) return;
          setSites((current) =>
            current.filter((site) => site.id !== siteToDelete.id),
          );
          setFeedback("Sitio eliminado correctamente.");
          setSiteToDelete(undefined);
        }}
      />

      {dialog?.type === "addressing" && (
        <AddressingDialog
          site={dialog.site}
          onClose={() => setDialog(undefined)}
          onChange={(addressing) => updateSite({ ...dialog.site, addressing })}
        />
      )}
      {dialog?.type === "inventory" && (
        <InventoryDialog
          site={dialog.site}
          onClose={() => setDialog(undefined)}
          onChange={(site) => updateSite(site)}
        />
      )}
    </main>
  );
}
