import type { SelectOption, SiteOption } from "../types/createTicket.types";

export const projectOptions: SelectOption[] = [
  {
    value: "project-3k",
    label: "Proyecto 3K",
  },
  {
    value: "wifi-mundial",
    label: "WiFi Mundial",
  },
  {
    value: "internal",
    label: "Proyecto interno",
  },
];

export const siteOptionsByProject: Record<string, SiteOption[]> = {
  "project-3k": [
    {
      value: "site-gdl",
      label: "Sitio Guadalajara",
      code: "GDL-001",
    },
    {
      value: "site-zapopan",
      label: "Sitio Zapopan",
      code: "ZAP-001",
    },
  ],

  "wifi-mundial": [
    {
      value: "site-tlaquepaque",
      label: "Sitio Tlaquepaque",
      code: "TLA-001",
    },
  ],

  internal: [],
};

export const categoryOptions: SelectOption[] = [
  {
    value: "network",
    label: "Red",
  },
  {
    value: "hardware",
    label: "Hardware",
  },
  {
    value: "software",
    label: "Software",
  },
  {
    value: "connectivity",
    label: "Conectividad",
  },
];

export const ticketTypeOptions: SelectOption[] = [
  {
    value: "incident",
    label: "Incidente",
  },
  {
    value: "request",
    label: "Solicitud",
  },
];

export const classificationOptions: SelectOption[] = [
  {
    value: "failure",
    label: "Falla",
  },
  {
    value: "configuration",
    label: "Configuración",
  },
  {
    value: "maintenance",
    label: "Mantenimiento",
  },
];
