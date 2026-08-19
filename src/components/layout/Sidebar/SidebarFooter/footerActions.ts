import {
  FileText,
  PanelTop,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import type { UserRole } from "../../../../auth/roles";

export interface FooterAction {
  id: string;
  label: string;
  icon: typeof ShieldCheck;
  roles: UserRole[];
}

export const FOOTER_ACTIONS: FooterAction[] = [
  {
    id: "release-provider",
    label: "Liberar proveedor",
    icon: UserRoundCheck,
    roles: ["admin", "supervisor"],
  },
  {
    id: "pending",
    label: "Pendientes",
    icon: PanelTop,
    roles: ["admin", "supervisor", "agent"],
  },
  {
    id: "reports",
    label: "Reportes",
    icon: FileText,
    roles: ["admin", "supervisor"],
  },
];

export function canViewFooterAction(action: FooterAction, role: UserRole) {
  return action.roles.includes(role);
}
