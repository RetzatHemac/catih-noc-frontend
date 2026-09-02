import { ROLES } from "./roles";

import type { AuthUser } from "./user.types";

export const mockUser: AuthUser = {
  id: "user-001",

  name: "Usuario Demo",

  email: "usuario.demo@hemac.com.mx",

  role: ROLES.SUPER_ADMIN,

  permissionOverrides: {
    grant: [],
    deny: [],
  },
};
