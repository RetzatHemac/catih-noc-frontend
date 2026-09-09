import { FileText, ShieldCheck } from "lucide-react";

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
    id: "reports",
    label: "Reportes",
    icon: FileText,
    permission: PERMISSIONS.DASHBOARD_GRAPH_VIEW,
  },
];

export function canViewFooterAction(action: FooterAction, user: AuthUser) {
  return can(user, action.permission);
}
