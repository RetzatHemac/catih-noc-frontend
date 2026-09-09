import { coverageOptions } from "../config/projectOptions";
import type { ProjectRecord } from "../types/project.types";

const projectNames = [
  ["Red Estatal 3K", "RE3K", "Gobierno de Jalisco"],
  ["WiFi Mundial Jalisco", "WMJ", "Red Jalisco"],
  ["Monitoreo Metropolitano", "MMET", "HEMAC"],
  ["Conectividad Escolar", "CEDU", "Gobierno de Jalisco"],
  ["Centros de Salud", "CSAL", "Red Jalisco"],
  ["Renovación de Core", "RCORE", "Cliente Demo"],
  ["Seguridad Perimetral", "SEGP", "HEMAC"],
  ["Enlaces Regionales", "EREG", "Red Jalisco"],
  ["Telefonía Administrada", "TELA", "Cliente Demo"],
  ["NOC Institucional", "NOCI", "Gobierno de Jalisco"],
  ["Infraestructura Norte", "INOR", "HEMAC"],
  ["Respaldo Energético", "RENE", "Red Jalisco"],
  ["Migración Inalámbrica", "MINA", "Cliente Demo"],
  ["Operación de Sitios", "OSIT", "Gobierno de Jalisco"],
] as const;

export const MOCK_PROJECTS: ProjectRecord[] = projectNames.map(
  ([name, shortName, client], index) => {
    const expired = index === 4 || index === 9;
    const sequence = String(12001 + index).padStart(5, "0");

    return {
      id: `project-${index + 1}`,
      kind: "Póliza",
      name,
      shortName,
      client,
      contractId: `CON-${sequence}-A${String(index + 1).padStart(3, "0")}`,
      contractTemplate: index % 2 === 0 ? "24X7" : "5X8A",
      status: expired ? "expired" : "active",
      endDate: expired
        ? "2025-12-31"
        : `2027-${String((index % 9) + 1).padStart(2, "0")}-28`,
      slaTemplate: index % 2 === 0 ? "24X7" : "5X8A",
      contractType: "Poliza",
      department: index % 2 === 0 ? "NOC" : "Servicios",
      ovProject: `OV-${9000 + index}`,
      projectNumber: `PR-${3000 + index}`,
      clientType: client === "HEMAC" ? "Interno" : "Publico",
      startDate: "2026-01-01",
      remoteAttention: { value: 30, unit: "minutes" },
      onsiteAttention: { value: 4, unit: "calendar-hours" },
      resolutionTime: { value: 8, unit: "calendar-hours" },
      contactName: "Contacto de proyecto",
      contactPhone: "3312345678",
      contactEmail: `contacto${index + 1}@ejemplo.mx`,
      services: {
        preventive: true,
        preventiveEvents: 2,
        catih: true,
        unlimitedTickets: true,
        phone: false,
        noc: true,
        serviceLevel: 1,
      },
      infrastructureIncluded: false,
      infrastructureServices: [],
      additionalInfrastructure: "",
      coverages: Object.fromEntries(
        coverageOptions.map((coverage) => [coverage, index % 3 === 0]),
      ),
      additionalCoverages: "",
      serviceAdministrator: "Ana Ramírez",
      projectAdministrator: "Carlos Méndez",
    };
  },
);
