export type TicketReportId =
  | "hemac"
  | "red-jal"
  | "scheduled-activity"
  | "filled-scheduled-activity"
  | "breakdown"
  | "replacements"
  | "replacements-excel"
  | "ticket-concentration"
  | "global-statistics";

export interface TicketReportOption {
  id: TicketReportId;
  label: string;
}

export const TICKET_REPORT_GROUPS: Array<{
  title: string;
  reports: TicketReportOption[];
}> = [
  {
    title: "Reportes operativos",
    reports: [
      { id: "hemac", label: "Reporte HEMAC" },
      { id: "red-jal", label: "Reporte Red Jal" },
      { id: "scheduled-activity", label: "Reporte actividad programada" },
      {
        id: "filled-scheduled-activity",
        label: "Reporte actividad programada lleno",
      },
    ],
  },
  {
    title: "Concentrados y desglose",
    reports: [
      { id: "breakdown", label: "Reporte de desglose" },
      { id: "replacements", label: "Reporte de reemplazos" },
      { id: "replacements-excel", label: "Reporte de reemplazos Excel" },
      { id: "ticket-concentration", label: "Concentrado de tickets" },
      { id: "global-statistics", label: "Estadístico global" },
    ],
  },
];
