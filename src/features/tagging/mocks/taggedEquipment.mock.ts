import type { TaggedEquipment } from "../types/taggedEquipment.types";

const models = ["ISR 4331", "Catalyst 9200", "FortiGate 60F", "Aironet 2802"];
const types = ["Router", "Switch", "Firewall", "Access point"];
const projects = [
  ["Red Estatal 3K", "RE3K", "Gobierno de Jalisco"],
  ["Conectividad Metropolitana", "CMET", "Servicios Hemac"],
  ["WiFi Mundial Jalisco", "WMJ", "Red Jalisco"],
] as const;
const statuses = ["Pendiente", "Etiquetado", "Validado"] as const;

export const MOCK_TAGGED_EQUIPMENT: TaggedEquipment[] = Array.from(
  { length: 26 },
  (_, index) => {
    const number = index + 1;
    const project = projects[index % projects.length]!;
    const model = models[index % models.length]!;

    return {
      id: `tagged-equipment-${number}`,
      fixedAssetId: `AF-${String(number).padStart(5, "0")}`,
      serialNumber: `SN${String(20260000 + number)}`,
      model,
      type: types[index % types.length]!,
      site: `SIT-${String((index % 14) + 1).padStart(4, "0")}`,
      status: statuses[index % statuses.length]!,
      dimensions: index % 2 === 0 ? "44 x 445 x 438 mm" : "30 x 216 x 160 mm",
      color: index % 2 === 0 ? "Negro" : "Gris",
      description: `Equipo ${model} registrado para etiquetado.`,
      projectName: project[0],
      projectShortName: project[1],
      company: project[2],
    };
  },
);
