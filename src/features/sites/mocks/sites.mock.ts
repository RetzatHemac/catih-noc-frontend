import { MOCK_PROJECTS } from "../../projects/mocks/projects.mock";
import type { SiteRecord } from "../types/site.types";

const municipalities = [
  "Guadalajara",
  "Zapopan",
  "Tlaquepaque",
  "Tonalá",
  "Tlajomulco",
  "El Salto",
  "Lagos de Moreno",
];

export const MOCK_SITES: SiteRecord[] = MOCK_PROJECTS.slice(0, 3).flatMap(
  (project, projectIndex) =>
    Array.from({ length: projectIndex === 0 ? 14 : 6 }, (_, index) => {
      const sequence = projectIndex * 20 + index + 1;
      const code = `SIT-${String(sequence).padStart(4, "0")}`;

      return {
        id: `site-${projectIndex + 1}-${index + 1}`,
        projectId: project.id,
        projectName: project.name,
        name: `Sitio ${municipalities[index % municipalities.length]} ${index + 1}`,
        code,
        latitude: Number((20.65 + index * 0.011).toFixed(6)),
        longitude: Number((-103.35 - index * 0.009).toFixed(6)),
        address: `Av. Proyecto ${100 + index}, Col. Centro`,
        municipality: municipalities[index % municipalities.length]!,
        state: "Jalisco",
        country: "México",
        addressing:
          index % 3 === 0
            ? [
                {
                  id: `address-${projectIndex}-${index}`,
                  ipAddress: `10.${projectIndex + 1}.${index}.10`,
                  subnetMask: "255.255.255.0",
                  gateway: `10.${projectIndex + 1}.${index}.1`,
                  primaryUser: "admin-site",
                  primaryPassword: "Mock#2026",
                  secondaryUser: "support-site",
                  secondaryPassword: "MockBackup#2026",
                  siteEquipment: "Router principal",
                  comments: "Acceso de demostración para integración.",
                },
              ]
            : [],
        inventory: {
          status: index % 2 === 0 ? "completed" : "pending",
          crewId: "crew-1",
          description: index % 2 === 0 ? "Inventario inicial del sitio." : "",
          observations: "",
          images: [
            {
              id: `site-image-${sequence}-1`,
              url: "/mocks/tickets/img-general-finding-001.webp",
              description: `Vista general de ${code}`,
              group: "general",
            },
            {
              id: `site-image-${sequence}-2`,
              url: "/mocks/tickets/img-before-replacement-001.jpeg",
              description: `Equipo antes del reemplazo en ${code}`,
              group: "replacement",
            },
          ],
          items: [
            {
              id: `inventory-${sequence}-1`,
              fixedAsset: `AF-${9000 + sequence}`,
              brand: "Huawei",
              model: "S5735",
              serial: `SER${2026000 + sequence}`,
              status: "Operando",
              company: project.client,
              replacement: index % 2 === 0 ? "No" : "Pendiente",
            },
          ],
        },
      } satisfies SiteRecord;
    }),
);

export const MOCK_CREWS = [
  { value: "crew-1", label: "Cuadrilla Centro" },
  { value: "crew-2", label: "Cuadrilla Norte" },
  { value: "crew-3", label: "Cuadrilla Sur" },
];
