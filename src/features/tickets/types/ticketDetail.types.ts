export type TicketStatus =
  | "CREADO"
  | "ASIGNADO"
  | "EN_PROCESO"
  | "PAUSADO"
  | "CERRADO"
  | "COTIZACION"
  | "RESUELTO";

export interface TicketSite {
  id: string;
  name: string;
  municipality: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface TicketLocation {
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
}

export interface OnsiteAttention {
  operationalLeader?: string;
  supervisor?: string;
  provider?: string;
  onsitePersonnel?: string[];
}

export type SLAStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface TicketSLA {
  name: string;

  remoteDeadline?: string;
  remoteActual?: string;
  remoteStatus: SLAStatus;

  onsiteDeadline?: string;
  onsiteActual?: string;
  onsiteStatus: SLAStatus;
}

export interface OnsiteAttention {
  operationalLeader?: string;
  supervisor?: string;
  provider?: string;
  onsitePersonnel?: string[];
}

export interface TicketImage {
  id: string;
  url: string;
  description?: string;
}

export interface TicketImageGroups {
  beforeReplacement: TicketImage[];
  afterReplacement: TicketImage[];
  beforeCurrent: TicketImage[];
  afterCurrent: TicketImage[];
  generalFinding: TicketImage[];
  closeFinding: TicketImage[];
}

export interface TicketActivity {
  id: string;
  date: string;
  time: string;
  person?: string;
  message: string;
}

export interface RelatedTicket {
  id: string;
  identifier: string;
  problemType: string;
  category: string;
}

export interface ReplacedEquipment {
  id: string;
  damagedBrand: string;
  damagedModel: string;
  damagedSerial: string;
  replacementBrand: string;
  replacementModel: string;
  replacementSerial: string;
  observations: string;
}

export interface IntervenedEquipment {
  id: string;
  brand: string;
  model: string;
  serial: string;
  observations: string;
}

export interface Material {
  id: string;
  provider: string;
  material: string;
  providerQuantity: number;
  supervisorQuantity: number;
  unit: string;
  reviewed: boolean;
  supervisor: string;
  comment: string;
}

export interface TicketDetail {
  id: string;
  identifier: string;
  helixId: string;

  site: TicketSite;

  status: TicketStatus;

  category: string;
  problemType: string;
  ticketType: string;

  assignedTo?: string;

  createdAt: string;
  resolvedAt?: string;
  closedAt?: string;
  scheduledAt?: string;

  provider?: string;

  resolutionTime?: string;

  dependencies?: string[];

  description: string;

  problemImages: TicketImage[];

  location: TicketLocation;

  sla: {
    first: TicketSLA;
    second: TicketSLA;
  };

  onsiteAttention: OnsiteAttention;

  pauseReasons: TicketActivity[];
  reassignmentReasons: TicketActivity[];
  remoteActivities: TicketActivity[];

  imageGroups: TicketImageGroups;

  relatedTickets: RelatedTicket[];

  replacedEquipment: ReplacedEquipment[];
  intervenedEquipment: IntervenedEquipment[];

  materials: Material[];
}
