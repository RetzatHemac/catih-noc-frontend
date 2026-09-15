import type { ReactNode } from "react";
import { can, useAuth, type Permission } from "../../auth";
import { StatusMessage } from "../../components/ui/StatusMessage/StatusMessage";

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
}

export function PermissionGate({ permission, children }: PermissionGateProps) {
  const { user } = useAuth();
  return can(user, permission) ? (
    children
  ) : (
    <StatusMessage tone="error">
      No tienes permiso para acceder a esta sección.
    </StatusMessage>
  );
}
