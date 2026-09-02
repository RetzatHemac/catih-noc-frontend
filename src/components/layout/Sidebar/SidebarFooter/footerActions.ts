import {
  FileText,
  PanelTop,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import {
  can,
  PERMISSIONS,
  type AuthUser,
  type Permission,
} from "../../../../auth";

export interface FooterAction {
  id: string;
  label: string;
  icon: typeof ShieldCheck;
  permission: Permission;
}

export const FOOTER_ACTIONS: FooterAction[] = [
  {
    id: "release-provider",
    label: "Liberar proveedor",
    icon: UserRoundCheck,
    permission: PERMISSIONS.TICKET_PROVIDER_ASSIGN,
  },
  {
    id: "pending",
    label: "Pendientes",
    icon: PanelTop,
    permission: PERMISSIONS.TICKET_TABLE_VIEW,
  },
  {
    id: "reports",
    label: "Reportes",
    icon: FileText,
    permission: PERMISSIONS.DASHBOARD_GRAPH_VIEW,
  },
];

export function canViewFooterAction(action: FooterAction, user: AuthUser) {
  return can(user, action.permission);
}
