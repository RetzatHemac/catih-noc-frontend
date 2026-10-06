import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AuthContext } from "./auth.context";
import {
  getCurrentUser,
  logout as logoutService,
} from "./auth.service";

import type { AuthUser } from "./user.types";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const usuario = await getCurrentUser();

      const authUser: AuthUser = {
        id: String(usuario.id),
        username: usuario.user_name,
        name: usuario.full_name,
        email: usuario.email ?? "",
        role: usuario.role_name,
        classification_code: usuario.classification_code,
        permissions: usuario.permissions,
      };

      setUser(authUser);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, [refreshUser]);

  const logout = async () => {
    try {
      await logoutService();
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: user !== null,
      refreshUser,
      logout,
    }),
    [user, loading, refreshUser],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
