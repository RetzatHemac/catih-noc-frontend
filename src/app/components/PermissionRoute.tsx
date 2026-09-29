import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../auth";

interface PermissionRouteProps {
  permission: string;
}

export function PermissionRoute({
  permission,
}: PermissionRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  const hasPermission =
    user.permissions.includes(permission);

  if (!hasPermission) {
    return <Navigate to="/welcome" replace />;
  }

  return <Outlet />;
}
