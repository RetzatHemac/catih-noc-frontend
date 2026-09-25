import { Outlet } from "react-router-dom";

import { useAuth } from "../auth";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>No autenticado</div>;
  }

  return <Outlet />;
}
