import type { TicketDetail } from "../types/ticketDetail.types";

export const mockTicketDetail: TicketDetail = {
  id: "ticket-001",
  identifier: "CA-2026-00124",
  helixId: "HELIX-845921",

  status: "ASIGNADO",

  site: {
    id: "site-001",
    name: "Sitio Guadalajara Centro",
    municipality: "Guadalajara",
    address: "Av. Juárez 123",
    latitude: 20.6763989,
    longitude: -103.3479102,
  },

  category: "Conectividad",
  problemType: "Sin servicio",
  ticketType: "Incidente",

  assignedTo: "Juan Pérez",

  createdAt: "2026-08-20 10:32",
  resolvedAt: undefined,
  closedAt: undefined,
  scheduledAt: "2026-08-27 09:00",

  provider: "Proveedor Demo",

  resolutionTime: "00:00:00",

  dependencies: ["Proveedor externo"],

  description:
    "El sitio presenta pérdida de conectividad desde las primeras horas de la mañana.",

  problemImages: [],

  location: {
    latitude: 20.6763989,
    longitude: -103.3479102,
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=20.6763989,-103.3479102",
  },

  sla: {
    first: {
      name: "Primer SLA",

      remoteDeadline: "2026-08-26 12:00",
      remoteActual: "2026-08-26 11:42",
      remoteStatus: "COMPLETED",

      onsiteDeadline: "2026-08-26 16:00",
      onsiteActual: undefined,
      onsiteStatus: "IN_PROGRESS",
    },

    second: {
      name: "Segundo SLA",

      remoteDeadline: "2026-08-26 13:00",
      remoteActual: undefined,
      remoteStatus: "PENDING",

      onsiteDeadline: "2026-08-26 18:00",
      onsiteActual: undefined,
      onsiteStatus: "PENDING",
    },
  },

  onsiteAttention: {
    operationalLeader: "Luis González",
    supervisor: "María Torres",
    provider: "Proveedor Demo",
    onsitePersonnel: ["Carlos Ramírez", "José Martínez"],
  },

  pauseReasons: [
    {
      id: "pause-001",
      date: "2026-08-26",
      time: "13:40",
      message: "Se pausa por espera de acceso al sitio.",
    },
    {
      id: "pause-002",
      date: "2026-08-26",
      time: "15:10",
      message: "Proveedor solicita ventana adicional.",
    },
  ],

  reassignmentReasons: [
    {
      id: "reassignment-001",
      date: "2026-08-26",
      time: "10:20",
      message: "Ticket reasignado por disponibilidad del personal.",
    },
  ],

  remoteActivities: [
    {
      id: "remote-001",
      date: "2026-08-26",
      time: "10:45",
      person: "Juan Pérez",
      message: "Se validó conectividad con el equipo remoto.",
    },
    {
      id: "remote-002",
      date: "2026-08-26",
      time: "11:15",
      person: "Ana Rodríguez",
      message: "Se solicita reinicio controlado del equipo.",
    },
  ],

  imageGroups: {
    beforeReplacement: [
      {
        id: "img-before-replacement-001",
        url: "https://picsum.photos/800/500?random=1",
        description: "Estado del equipo antes del reemplazo.",
      },
      {
        id: "img-before-replacement-002",
        url: "https://picsum.photos/800/500?random=2",
        description: "Detalle de conexiones antes del reemplazo.",
      },
    ],

    afterReplacement: [
      {
        id: "img-after-replacement-001",
        url: "https://picsum.photos/800/500?random=3",
        description: "Equipo instalado después del reemplazo.",
      },
    ],

    beforeCurrent: [
      {
        id: "img-before-current-001",
        url: "https://picsum.photos/800/500?random=4",
        description: "Condición previa a la intervención actual.",
      },
    ],

    afterCurrent: [
      {
        id: "img-after-current-001",
        url: "https://picsum.photos/800/500?random=5",
        description: "Condición posterior a la intervención.",
      },
    ],

    generalFinding: [
      {
        id: "img-general-finding-001",
        url: "https://picsum.photos/800/500?random=6",
        description: "Vista general del hallazgo.",
      },
    ],

    closeFinding: [
      {
        id: "img-close-finding-001",
        url: "https://picsum.photos/800/500?random=7",
        description: "Acercamiento del hallazgo detectado.",
      },
    ],
  },

  relatedTickets: [
    {
      id: "ticket-related-001",
      identifier: "CAT-10243",
      problemType: "Sin servicio",
      category: "Red LAN",
    },
    {
      id: "ticket-related-002",
      identifier: "CAT-10240",
      problemType: "Intermitencia",
      category: "Proveedor",
    },
  ],

  replacedEquipment: [
    {
      id: "replaced-001",

      damagedBrand: "Huawei",
      damagedModel: "AR6121",
      damagedSerial: "HW-AR6121-001245",

      replacementBrand: "Huawei",
      replacementModel: "AR6140",
      replacementSerial: "HW-AR6140-008541",

      observations: "Equipo sin encender. Se sustituye por unidad compatible.",
    },
    {
      id: "replaced-002",

      damagedBrand: "Cisco",
      damagedModel: "C9200L",
      damagedSerial: "FCW2451AB12",

      replacementBrand: "Cisco",
      replacementModel: "C9200L",
      replacementSerial: "FCW2512CD34",

      observations: "Equipo con falla en alimentación principal.",
    },
  ],

  intervenedEquipment: [
    {
      id: "intervened-001",
      brand: "APC",
      model: "Smart-UPS 1500",
      serial: "AS22184567",
      observations: "Se revisan conexiones y se realiza reinicio controlado.",
    },
    {
      id: "intervened-002",
      brand: "Huawei",
      model: "S5735",
      serial: "210235A1BCD",
      observations: "Se ajusta configuración de puerto y se valida enlace.",
    },
  ],

  materials: [
    {
      id: "material-001",
      provider: "Proveedor Demo",
      material: "Cable UTP Cat6",
      providerQuantity: 25,
      supervisorQuantity: 25,
      unit: "Metros",
      reviewed: true,
      supervisor: "María Torres",
      comment: "Cantidad validada en sitio.",
    },
    {
      id: "material-002",
      provider: "Proveedor Demo",
      material: "Conector RJ45",
      providerQuantity: 8,
      supervisorQuantity: 8,
      unit: "Piezas",
      reviewed: true,
      supervisor: "María Torres",
      comment: "Material utilizado en recableado.",
    },
    {
      id: "material-003",
      provider: "Proveedor Demo",
      material: "Patch cord Cat6 2 m",
      providerQuantity: 4,
      supervisorQuantity: 3,
      unit: "Piezas",
      reviewed: false,
      supervisor: "María Torres",
      comment: "Pendiente validar una pieza no utilizada.",
    },
    {
      id: "material-004",
      provider: "Proveedor Norte",
      material: "Cinchos plásticos",
      providerQuantity: 20,
      supervisorQuantity: 20,
      unit: "Piezas",
      reviewed: false,
      supervisor: "Luis González",
      comment: "",
    },
  ],
};
