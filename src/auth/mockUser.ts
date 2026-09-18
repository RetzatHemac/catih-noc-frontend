import { ROLES } from "./roles";

import type { AuthUser } from "./user.types";

export const mockUser: AuthUser = {
  id: "user-001",

  username: "usuario.demo",

  name: "Usuario Demo",

  email: "usuario.demo@hemac.com.mx",

  role: ROLES.SUPER_ADMIN,
  company: {
    id: "hemac",
    name: "Hemac",
    logoUrl: "/mocks/tickets/img-after-current-001.jpg",
    isDemoImage: true,
  },

  permissionOverrides: {
    grant: [],
    deny: [],
  },
};
