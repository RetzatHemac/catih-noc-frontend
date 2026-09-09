export interface SiteAddressing {
  id: string;
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  primaryUser: string;
  primaryPassword: string;
  secondaryUser: string;
  secondaryPassword: string;
  siteEquipment: string;
  comments: string;
}

export interface SiteImage {
  id: string;
  url: string;
  description: string;
  group: "general" | "replacement";
}

export interface SiteInventoryItem {
  id: string;
  fixedAsset: string;
  brand: string;
  model: string;
  serial: string;
  status: string;
  company: string;
  replacement: string;
}

export interface SiteInventory {
  status: "pending" | "completed";
  crewId: string;
  inaccessibleReason?: string;
  description: string;
  observations: string;
  images: SiteImage[];
  items: SiteInventoryItem[];
}

export interface SiteRecord {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  address: string;
  municipality: string;
  state: string;
  country: string;
  addressing: SiteAddressing[];
  inventory: SiteInventory;
}
