import { can, PERMISSIONS, type AuthUser } from "../../../auth";

import type { TicketStatus } from "../types/ticketDetail.types";

export interface TicketDetailCapabilities {
  canStartTicket: boolean;
  canDeleteTicket: boolean;
  canEditTicket: boolean;
  canEditSite: boolean;
  canChangeSiteAddress: boolean;
  canReportActivities: boolean;
  canDeleteObjects: boolean;
  canViewImages: boolean;
  canAssignProvider: boolean;
  canReportReplacements: boolean;
  canViewMaterials: boolean;
  canValidateMaterials: boolean;
}

export function canStartTicket(
  user: AuthUser,
  ticketStatus: TicketStatus,
): boolean {
  return can(user, PERMISSIONS.TICKET_START) && ticketStatus === "ASIGNADO";
}

export function getTicketDetailCapabilities(
  user: AuthUser,
  ticketStatus: TicketStatus,
): TicketDetailCapabilities {
  return {
    canStartTicket: canStartTicket(user, ticketStatus),
    canDeleteTicket: can(user, PERMISSIONS.TICKET_DELETE),
    canEditTicket: can(user, PERMISSIONS.TICKET_EDIT),
    canEditSite: can(user, PERMISSIONS.TICKET_SITE_EDIT),
    canChangeSiteAddress: can(user, PERMISSIONS.TICKET_SITE_ADDRESS_CHANGE),
    canReportActivities: can(user, PERMISSIONS.TICKET_ACTIVITIES_REPORT),
    canDeleteObjects: can(user, PERMISSIONS.TICKET_OBJECTS_DELETE),
    canViewImages: can(user, PERMISSIONS.TICKET_IMAGES_VIEW),
    canAssignProvider: can(user, PERMISSIONS.TICKET_PROVIDER_ASSIGN),
    canReportReplacements: can(user, PERMISSIONS.TICKET_REPLACEMENTS_REPORT),
    canViewMaterials: can(user, PERMISSIONS.TICKET_MATERIALS_VIEW),
    canValidateMaterials: can(user, PERMISSIONS.TICKET_MATERIALS_VALIDATE),
  };
}
