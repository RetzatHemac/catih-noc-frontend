import type { ProjectRecord } from "../types/project.types";

export function downloadProjectsReport(projects: ProjectRecord[]) {
  const rows = [
    [
      "Tipo",
      "Nombre de proyecto",
      "Nombre corto",
      "Cliente",
      "Id de contrato",
      "Plantilla de contrato",
      "Estado",
      "Fecha de finalización",
    ],
    ...projects.map((project) => [
      project.kind,
      project.name,
      project.shortName,
      project.client,
      project.contractId,
      project.contractTemplate,
      project.status === "active" ? "Activo" : "Expirado",
      project.endDate,
    ]),
  ];
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","),
    )
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");

  link.href = url;
  link.download = "reporte-proyectos.csv";
  link.click();
  URL.revokeObjectURL(url);
}
