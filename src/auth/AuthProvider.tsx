import { useMemo, type ReactNode } from "react";

import { AuthContext } from "./auth.context";
import { mockUser } from "./mockUser";
import type { AuthUser } from "./user.types";

interface AuthProviderProps {
  children: ReactNode;
  user?: AuthUser;
}

export function AuthProvider({ children, user = mockUser }: AuthProviderProps) {
  const value = useMemo(() => ({ user }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
