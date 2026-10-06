import conectNest from "../../../app/contexts/conectNest";
import type { SelectOption } from "../types/createTicket.types";

export async function getCategoryOptions(): Promise<SelectOption[]> {
  const response = await conectNest.get("/tickets/categories");

  return response.data.map(
    (category: {
      id: number;
      category_name: string;
    }) => ({
      value: String(category.id),
      label: category.category_name,
    }),
  );
}

export async function getTypeOptions(): Promise<SelectOption[]> {
  const response = await conectNest.get("/tickets/types");

  return response.data.map(
    (type: {
      id: number;
      type_name: string;
    }) => ({
      value: String(type.id),
      label: type.type_name,
    }),
  );
}

export async function getProjectOptions(): Promise<SelectOption[]> {
  const response = await conectNest.get("/tickets/projects");

  return response.data.map(
    (project: {
      id: number;
      short_name: string;
      project_code: string;
    }) => ({
      value: String(project.id),
      label: project.project_code + " - " + project.short_name,
    }),
  );
}

export async function getSiteOptionsByProject(projectId: string): Promise<SelectOption[]> {
    const response = await conectNest.get(`/tickets/projects/${projectId}/sites`,);
    return response.data.map(
        (site: {
        id: number;
        site_name: string;
        site_code: string;
        }) => ({
        value: String(site.id),
        label: site.site_code,
        }),
    );
}

