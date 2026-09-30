import type { SelectOption, SiteOption } from "../types/createTicket.types";

export const projectOptions: SelectOption[] = [
  {
    value: "1",
    label: "Proyecto 3K",
  },
  {
    value: "2",
    label: "WiFi Mundial",
  },
  {
    value: "3",
    label: "Proyecto interno",
  },
];

export const siteOptionsByProject: Record<string, SiteOption[]> = {
  "1": [
    {
      value: "1",
      label: "Sitio Guadalajara",
      code: "GDL-001",
    },
    {
      value: "2",
      label: "Sitio Zapopan",
      code: "ZAP-001",
    },
  ],

  "2": [
    {
      value: "3",
      label: "Sitio Tlaquepaque",
      code: "TLA-001",
    },
  ],

  internal: [],
};

export const categoryOptions: SelectOption[] = [
  {
    value: "1",
    label: "Red",
  },
  {
    value: "2",
    label: "Hardware",
  },
  {
    value: "3",
    label: "Software",
  },
  {
    value: "4",
    label: "Conectividad",
  },
];

export const ticketTypeOptions: SelectOption[] = [
  {
    value: "1",
    label: "Incidente",
  },
  {
    value: "2",
    label: "Solicitud",
  },
];
