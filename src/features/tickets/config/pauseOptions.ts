import type { TicketActivity } from "../types/ticketDetail.types";

export type PauseDependency = NonNullable<TicketActivity["dependency"]>;

export const PAUSE_DEPENDENCY_OPTIONS = [
  { value: "CLIENTE", label: "Cliente" },
  { value: "HEMAC", label: "HEMAC" },
  { value: "EQUIPO", label: "Equipo" },
  { value: "PGH", label: "PGH" },
] satisfies Array<{ value: PauseDependency; label: string }>;

export const PAUSE_REASON_OPTIONS: Record<PauseDependency, string[]> = {
  CLIENTE: [
    "Sin acceso al sitio",
    "Ventana de mantenimiento",
    "Validación pendiente",
  ],
  HEMAC: ["Asignación de personal", "Validación NOC", "Escalamiento interno"],
  EQUIPO: [
    "Equipo sin disponibilidad",
    "Falla de hardware",
    "Esperando reemplazo",
  ],
  PGH: [
    "Autorización pendiente",
    "Coordinación con proveedor",
    "Información pendiente",
  ],
};
