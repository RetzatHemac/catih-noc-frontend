import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../auth";

const LOGIN_URL = "http://localhost:5173";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.replace(LOGIN_URL);
    }
  }, [loading, user]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return null; // o un "Redirigiendo..." mientras el navegador cambia de página
  }

  return <Outlet />;
}
