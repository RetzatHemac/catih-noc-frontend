export type TaggingStatus = "Pendiente" | "Etiquetado" | "Validado";

export interface TaggedEquipment {
  id: string;
  fixedAssetId: string;
  serialNumber: string;
  model: string;
  type: string;
  site: string;
  status: TaggingStatus;
  dimensions: string;
  color: string;
  description: string;
  projectName: string;
  projectShortName: string;
  company: string;
}
