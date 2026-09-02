import { createContext } from "react";

import type { AuthUser } from "./user.types";

export interface AuthContextValue {
  user: AuthUser;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
