import {
  TICKET_REPORT_GROUPS,
  type TicketReportId,
} from "../config/reportOptions";
import type { TicketDetail } from "../types/ticketDetail.types";

const CSV_REPORTS: TicketReportId[] = [
  "replacements-excel",
  "ticket-concentration",
  "global-statistics",
];

export function downloadTicketReport(
  ticket: TicketDetail,
  reportId: TicketReportId,
): void {
  const report = TICKET_REPORT_GROUPS.flatMap((group) => group.reports).find(
    (option) => option.id === reportId,
  );
  const isCsv = CSV_REPORTS.includes(reportId);
  const title = report?.label ?? reportId;
  const content = isCsv ? createCsv(ticket, title) : createText(ticket, title);
  const blob = new Blob([content], {
    type: isCsv ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${ticket.identifier}-${reportId}.${isCsv ? "csv" : "txt"}`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function createText(ticket: TicketDetail, title: string): string {
  return [
    title,
    `Ticket: ${ticket.identifier}`,
    `Helix: ${ticket.helixId}`,
    `Estatus: ${ticket.status}`,
    `Sitio: ${ticket.site.name}`,
    `Dirección: ${ticket.site.address}`,
    `Categoría: ${ticket.category}`,
    `Problema: ${ticket.problemType}`,
    `Asignado a: ${ticket.assignedTo ?? "Sin asignar"}`,
    "",
    "Descripción:",
    ticket.description,
  ].join("\n");
}

function createCsv(ticket: TicketDetail, title: string): string {
  const rows = [
    ["Reporte", "Ticket", "Helix", "Estatus", "Sitio", "Categoría"],
    [
      title,
      ticket.identifier,
      ticket.helixId,
      ticket.status,
      ticket.site.name,
      ticket.category,
    ],
  ];

  return `\uFEFF${rows.map((row) => row.map(escapeCsv).join(",")).join("\n")}`;
}

function escapeCsv(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}
