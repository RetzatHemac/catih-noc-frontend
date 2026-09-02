import {
  Activity,
  CalendarClock,
  Camera,
  CircleCheckBig,
  Copy,
  FileDown,
  GitFork,
  MessageCircle,
  PackageSearch,
  Pause,
  StickyNote,
  Wrench,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { PERMISSIONS, type Permission } from "../../../auth";

import type { TicketStatus } from "../types/ticketDetail.types";

export type TaskbarActionId =
  | "open-chat"
  | "manage-notes"
  | "upload-images"
  | "report-activity"
  | "manage-inventory"
  | "report-intervention"
  | "pause-ticket"
  | "schedule-visit"
  | "manage-related-tickets"
  | "duplicate-ticket"
  | "close-ticket"
  | "download-reports";

export interface TaskbarActionConfig {
  id: TaskbarActionId;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
  allowedStatuses?: TicketStatus[];
  hiddenStatuses?: TicketStatus[];
  title?: string;
}

const CLOSED_STATUS: TicketStatus[] = ["CERRADO"];

export const TASKBAR_ACTIONS: TaskbarActionConfig[] = [
  {
    id: "open-chat",
    label: "Chat",
    title: "Abrir chat",
    icon: MessageCircle,
    permission: PERMISSIONS.TICKET_NOTES_MANAGE,
    hiddenStatuses: CLOSED_STATUS,
  },
  {
    id: "manage-notes",
    label: "Notas",
    title: "Gestionar notas",
    icon: StickyNote,
    permission: PERMISSIONS.TICKET_NOTES_MANAGE,
    hiddenStatuses: CLOSED_STATUS,
  },
  {
    id: "upload-images",
    label: "Imágenes",
    title: "Subir imágenes",
    icon: Camera,
    permission: PERMISSIONS.TICKET_IMAGES_UPLOAD,
    hiddenStatuses: CLOSED_STATUS,
  },
  {
    id: "report-activity",
    label: "Actividad",
    title: "Reportar actividad",
    icon: Activity,
    permission: PERMISSIONS.TICKET_ACTIVITIES_REPORT,
    hiddenStatuses: CLOSED_STATUS,
  },
  {
    id: "manage-inventory",
    label: "Inventario",
    title: "Registrar equipo de inventario",
    icon: PackageSearch,
    permission: PERMISSIONS.TICKET_REPLACEMENTS_REPORT,
    hiddenStatuses: CLOSED_STATUS,
  },
  {
    id: "report-intervention",
    label: "Intervención",
    title: "Reportar intervención",
    icon: Wrench,
    permission: PERMISSIONS.TICKET_INTERVENTIONS_REPORT,
    hiddenStatuses: CLOSED_STATUS,
  },
  {
    id: "pause-ticket",
    label: "Pausar",
    title: "Pausar ticket",
    icon: Pause,
    permission: PERMISSIONS.TICKET_PAUSE,
    allowedStatuses: ["EN_PROCESO"],
  },
  {
    id: "schedule-visit",
    label: "Agenda",
    title: "Agendar visita",
    icon: CalendarClock,
    permission: PERMISSIONS.TICKET_PROVIDER_ASSIGN,
    hiddenStatuses: CLOSED_STATUS,
  },
  {
    id: "manage-related-tickets",
    label: "Padres",
    title: "Gestionar tickets padre e hijo",
    icon: GitFork,
    permission: PERMISSIONS.TICKET_RELATED_MANAGE,
    hiddenStatuses: CLOSED_STATUS,
  },
  {
    id: "duplicate-ticket",
    label: "Duplicar",
    title: "Duplicar ticket",
    icon: Copy,
    permission: PERMISSIONS.TICKET_MANAGE,
    hiddenStatuses: CLOSED_STATUS,
  },
  {
    id: "close-ticket",
    label: "Cerrar",
    title: "Cerrar ticket",
    icon: CircleCheckBig,
    permission: PERMISSIONS.TICKET_STATUS_CHANGE,
    hiddenStatuses: CLOSED_STATUS,
  },
  {
    id: "download-reports",
    label: "Reportes",
    title: "Descargar reportes",
    icon: FileDown,
    permission: PERMISSIONS.TICKET_REPORT_DOWNLOAD,
  },
];
