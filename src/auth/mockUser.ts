import type { UserRole } from "./roles";

export interface MockUser {
  id: string;
  name: string;
  role: UserRole;
}

export const mockUser: MockUser = {
  id: "1",
  name: "Administrador",
  role: "admin",
};
