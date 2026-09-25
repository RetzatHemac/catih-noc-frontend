import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import conectNest from "./conectNest";
import axios from "axios";

// export interface AuthUser {
//   id: number;
//   public_id: string;
//   user_name: string;
//   first_name: string;
//   last_name: string;
//   full_name: string;
//   email: string | null;
//   company_id: number;
//   company_name: string;
//   role_name: string;
//   permissions: string[];
// }

export interface AuthUser {
  id: string;
  username?: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  permissions: string[];
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
    const { data } = await conectNest.get("/auth/me");

    console.warn("🔥 AUTH ME OK:", data);

    setUser(data.usuario);
    console.warn( "🔥 USUARIO RECIBIDO POR AUTHCONTEXT:", data.usuario, );
    } catch (error) {
    if (axios.isAxiosError(error)) {
        console.warn(
        "🔥 AUTH ME ERROR:",
        error.response?.status,
        error.response?.data,
        );
    } else {
        console.warn("🔥 AUTH ME ERROR DESCONOCIDO:", error);
    }

    setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await conectNest.post("/auth/logout");
    } catch {
      // La sesión puede ya estar expirada.
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);

      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, [refreshUser]);

  const permissions = user?.permissions ?? [];

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      permissions,
      loading,
      isAuthenticated: user !== null,
      refreshUser,
      logout,
    }),
    [
      user,
      permissions,
      loading,
      refreshUser,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de un AuthProvider",
    );
  }

  return context;
}

