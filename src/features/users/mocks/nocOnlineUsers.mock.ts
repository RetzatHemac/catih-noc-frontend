import type { NocOnlineUser } from "../types/nocOnlineUser.types";

export const MOCK_NOC_ONLINE_USERS: NocOnlineUser[] = [
  {
    id: "noc-user-001",
    name: "Ana Rodríguez",
    roleLabel: "Agente RJ",
    status: "online",
  },
  {
    id: "noc-user-002",
    name: "Luis González",
    roleLabel: "Agente PGH",
    status: "online",
  },
  {
    id: "noc-user-003",
    name: "María Torres",
    roleLabel: "NOC Supervisor",
    status: "online",
  },
  {
    id: "noc-user-004",
    name: "Juan Pérez",
    roleLabel: "Analista",
    status: "online",
  },
];
