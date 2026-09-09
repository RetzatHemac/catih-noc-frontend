import {
  Download,
  FilePlus2,
  Pencil,
  Plus,
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
import { MOCK_PROJECTS } from "../../mocks/projects.mock";
import type { ProjectRecord, ProjectStatus } from "../../types/project.types";
import { downloadProjectsReport } from "../../utils/downloadProjectsReport";
import { filterProjects, paginateProjects } from "../../utils/projectTable";
import { ImplementationForm } from "../ImplementationForm/ImplementationForm";
import { ProjectForm } from "../ProjectForm/ProjectForm";

import styles from "./ProjectsPage.module.css";

type ViewMode = "table" | "project" | "implementation";
type PageSize = 10 | 25 | 50 | 100;

const pageSizeOptions = [10, 25, 50, 100].map((size) => ({
  value: String(size),
  label: `${size} filas`,
}));
const statusOptions = [
  { value: "active", label: "Activo" },
  { value: "expired", label: "Expirado" },
];

export function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [mode, setMode] = useState<ViewMode>("table");
  const [editingProject, setEditingProject] = useState<ProjectRecord>();
  const [projectToDelete, setProjectToDelete] = useState<ProjectRecord>();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | ProjectStatus>("");
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState("");

  const canView = can(user, PERMISSIONS.PROJECTS_VIEW);
  const canCreate = can(user, PERMISSIONS.PROJECTS_CREATE);
  const canCreateImplementation = can(user, PERMISSIONS.IMPLEMENTATIONS_CREATE);
  const canEdit = can(user, PERMISSIONS.PROJECTS_MANAGE);
  const canDelete = can(user, PERMISSIONS.PROJECTS_DELETE);
  const filteredProjects = useMemo(
    () => filterProjects(projects, { query, status }),
    [projects, query, status],
  );
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleProjects = useMemo(
    () => paginateProjects(filteredProjects, currentPage, pageSize),
    [currentPage, filteredProjects, pageSize],
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
          No tienes permiso para consultar proyectos.
        </StatusMessage>
      </main>
    );
  }

  function returnToTable() {
    setMode("table");
    setEditingProject(undefined);
  }

  function saveProject(project: ProjectRecord) {
    setProjects((current) => {
      const exists = current.some((item) => item.id === project.id);
      return exists
        ? current.map((item) => (item.id === project.id ? project : item))
        : [project, ...current];
    });
    setFeedback(
      editingProject
        ? "Proyecto actualizado correctamente."
        : "Proyecto creado correctamente.",
    );
    setPage(1);
    returnToTable();
  }

  if (mode === "project") {
    return (
      <main className={styles.formPage}>
        <ProjectForm
          project={editingProject}
          onSave={saveProject}
          onCancel={returnToTable}
        />
      </main>
    );
  }

  if (mode === "implementation") {
    return (
      <main className={styles.formPage}>
        <ImplementationForm
          onCancel={returnToTable}
          onSave={(project) => {
            setProjects((current) => [project, ...current]);
            setFeedback("Implementación creada correctamente.");
            setPage(1);
            returnToTable();
          }}
        />
      </main>
    );
  }

  const columns: DataTableColumn<ProjectRecord>[] = [
    { key: "kind", header: "Tipo", render: (project) => project.kind },
    {
      key: "name",
      header: "Nombre de proyecto",
      render: (project) => <strong>{project.name}</strong>,
    },
    {
      key: "shortName",
      header: "Nombre corto",
      render: (project) => project.shortName,
    },
    { key: "client", header: "Cliente", render: (project) => project.client },
    {
      key: "contractId",
      header: "Id de contrato",
      render: (project) => (
        <span className={styles.code}>{project.contractId}</span>
      ),
    },
    {
      key: "template",
      header: "Plantilla de contrato",
      render: (project) => (
        <span className={styles.code}>{project.contractTemplate}</span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (project) => (
        <span className={styles.status} data-status={project.status}>
          {project.status === "active" ? "Activo" : "Expirado"}
        </span>
      ),
    },
    {
      key: "endDate",
      header: "Fecha de finalización",
      render: (project) => formatDate(project.endDate),
    },
  ];

  return (
    <main className={styles.page}>
      {feedback && <StatusMessage tone="success">{feedback}</StatusMessage>}

      <section
        className={styles.panel}
        aria-label="Administración de proyectos"
      >
        <div className={styles.toolbar}>
          <div className={styles.searchField}>
            <Search size={18} aria-hidden="true" />
            <Input
              type="search"
              value={query}
              placeholder="Buscar por nombre, nombre corto, empresa o id"
              aria-label="Buscar proyectos"
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <label className={styles.filterField} htmlFor="projects-page-size">
            <span>Filas por página</span>
            <Select
              id="projects-page-size"
              value={String(pageSize)}
              options={pageSizeOptions}
              onChange={(event) => {
                setPageSize(Number(event.target.value) as PageSize);
                setPage(1);
              }}
            />
          </label>

          <label className={styles.filterField} htmlFor="projects-status">
            <span>Estado</span>
            <Select
              id="projects-status"
              value={status}
              options={statusOptions}
              placeholder="Todos"
              onChange={(event) => {
                setStatus(event.target.value as "" | ProjectStatus);
                setPage(1);
              }}
            />
          </label>
        </div>

        <div className={styles.primaryActions}>
          {canCreate && (
            <Button onClick={() => setMode("project")}>
              <Plus size={18} aria-hidden="true" /> Nuevo proyecto
            </Button>
          )}
          {canCreateImplementation && (
            <Button
              variant="secondary"
              onClick={() => setMode("implementation")}
            >
              <FilePlus2 size={18} aria-hidden="true" /> Nueva implementación
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => downloadProjectsReport(filteredProjects)}
          >
            <Download size={18} aria-hidden="true" /> Reporte
          </Button>
        </div>

        <div className={styles.resultSummary} role="status">
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1 ? "proyecto" : "proyectos"}
        </div>

        <DataTable
          data={visibleProjects}
          columns={columns}
          getRowId={(project) => project.id}
          emptyLabel="No hay proyectos que coincidan con la búsqueda."
          actions={
            canEdit || canDelete
              ? (project) => (
                  <div className={styles.rowActions}>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Editar ${project.name}`}
                        title="Editar"
                        onClick={() => {
                          setEditingProject(project);
                          setMode("project");
                        }}
                      >
                        <Pencil size={16} aria-hidden="true" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Eliminar ${project.name}`}
                        title="Eliminar"
                        onClick={() => setProjectToDelete(project)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </Button>
                    )}
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

      <ConfirmDialog
        open={Boolean(projectToDelete)}
        title="Eliminar proyecto"
        description={`¿Estás seguro de eliminar ${projectToDelete?.name ?? "este proyecto"}? Esta acción se simulará en el frontend.`}
        confirmLabel="Eliminar proyecto"
        danger
        onClose={() => setProjectToDelete(undefined)}
        onConfirm={() => {
          if (!projectToDelete) return;
          setProjects((current) =>
            current.filter((project) => project.id !== projectToDelete.id),
          );
          setFeedback("Proyecto eliminado correctamente.");
          setProjectToDelete(undefined);
        }}
      />
    </main>
  );
}

function formatDate(date: string): string {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(
    new Date(`${date}T00:00:00`),
  );
}
