import type { SiteRecord } from "../types/site.types";

export function filterSites(
  sites: SiteRecord[],
  projectId: string,
  query: string,
) {
  if (!projectId) return [];
  const normalizedQuery = normalize(query);

  return sites.filter(
    (site) =>
      site.projectId === projectId &&
      (!normalizedQuery ||
        [site.name, site.municipality].some((value) =>
          normalize(value).includes(normalizedQuery),
        )),
  );
}

export function paginateSites(
  sites: SiteRecord[],
  page: number,
  pageSize: number,
) {
  return sites.slice((page - 1) * pageSize, page * pageSize);
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX")
    .trim();
}
