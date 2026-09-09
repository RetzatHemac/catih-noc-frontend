export type ProjectStatus = "active" | "expired";
export type ProjectKind = "Póliza" | "Implementación";

export interface AttentionTime {
  value: number;
  unit: string;
}

export interface ProjectServices {
  preventive: boolean;
  preventiveEvents?: number;
  catih: boolean;
  unlimitedTickets?: boolean;
  phone: boolean;
  authorizedTickets?: number;
  noc: boolean;
  serviceLevel?: number;
}

export interface ProjectRecord {
  id: string;
  kind: ProjectKind;
  name: string;
  shortName: string;
  client: string;
  contractId: string;
  contractTemplate: string;
  status: ProjectStatus;
  endDate: string;
  slaTemplate: string;
  contractType: string;
  department: string;
  ovProject: string;
  projectNumber: string;
  clientType: string;
  startDate: string;
  remoteAttention: AttentionTime;
  onsiteAttention: AttentionTime;
  resolutionTime: AttentionTime;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  services: ProjectServices;
  infrastructureIncluded: boolean;
  infrastructureServices: string[];
  additionalInfrastructure: string;
  coverages: Record<string, boolean>;
  additionalCoverages: string;
  serviceAdministrator: string;
  projectAdministrator: string;
  implementationReasons?: string;
  projectAnalyst?: string;
}
