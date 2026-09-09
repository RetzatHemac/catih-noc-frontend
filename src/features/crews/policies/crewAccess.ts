import { can, PERMISSIONS, type AuthUser } from "../../../auth";

export function canReleaseCrew(user: AuthUser): boolean {
  return can(user, PERMISSIONS.TICKET_CREW_RELEASE);
}
