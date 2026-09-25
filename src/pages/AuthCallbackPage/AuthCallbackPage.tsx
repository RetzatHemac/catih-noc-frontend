import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import conectNest from "../../app/contexts/conectNest";
import { useAuth } from "../../auth";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const exchangeToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setError("No se recibió el token de autenticación.");
        return;
      }

      try {
        await conectNest.post("/auth/exchange", {
          token,
        });

        window.history.replaceState(
          {},
          "",
          "/auth/callback",
        );

        await refreshUser();

        navigate("/welcome", {
          replace: true,
        });
      } catch (err) {
        console.error(
          "Error autenticando CATIH:",
          err,
        );

        setError(
          "No fue posible iniciar sesión en CATIH.",
        );
      }
    };

    void exchangeToken();
  }, [navigate, searchParams, refreshUser]);

  if (error) {
    return (
      <div>
        <h1>Error de autenticación</h1>
        <p>{error}</p>
      </div>
    );
  }

  return <div>Iniciando sesión en CATIH...</div>;
}
