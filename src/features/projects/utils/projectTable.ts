import type { ProjectRecord, ProjectStatus } from "../types/project.types";

export interface ProjectTableFilters {
  query: string;
  status: "" | ProjectStatus;
}

export function filterProjects(
  projects: ProjectRecord[],
  filters: ProjectTableFilters,
): ProjectRecord[] {
  const query = normalize(filters.query);

  return projects.filter((project) => {
    const matchesStatus = !filters.status || project.status === filters.status;
    const matchesQuery =
      !query ||
      [
        project.id,
        project.name,
        project.shortName,
        project.client,
        project.contractId,
      ]
        .map(normalize)
        .some((value) => value.includes(query));

    return matchesStatus && matchesQuery;
  });
}

export function paginateProjects(
  projects: ProjectRecord[],
  page: number,
  pageSize: number,
): ProjectRecord[] {
  const start = (page - 1) * pageSize;
  return projects.slice(start, start + pageSize);
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX")
    .trim();
}
