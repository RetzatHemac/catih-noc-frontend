export const PERMISSIONS = {
  // Tickets
  TICKET_CREATE: "ticket.create",
  TICKET_DASHBOARD_VIEW: "ticket.dashboard.view",
  TICKET_VIEW_ALL: "ticket.view.all",
  TICKET_VIEW_INFO: "ticket.view.info",
  TICKET_SUPPORT_VIEW: "ticket.support.view",
  TICKET_TABLE_VIEW: "ticket.table.view",
  TICKET_EDIT: "ticket.edit",
  TICKET_MANAGE: "ticket.manage",
  TICKET_DELETE: "ticket.delete",
  TICKET_NOTES_MANAGE: "ticket.notes.manage",
  TICKET_OBJECTS_DELETE: "ticket.objects.delete",
  TICKET_DOCUMENTS_DOWNLOAD: "ticket.documents.download",

  // Sitio dentro del ticket
  TICKET_SITE_EDIT: "ticket.site.edit",
  TICKET_SITE_ADDRESS_CHANGE: "ticket.site.address.change",

  // Imágenes
  TICKET_IMAGES_VIEW: "ticket.images.view",
  TICKET_IMAGES_UPLOAD: "ticket.images.upload",

  // Actividades
  TICKET_ACTIVITIES_REPORT: "ticket.activities.report",
  TICKET_ACTIVITIES_REPORT_APP: "ticket.activities.report.app",

  // Reemplazos
  TICKET_REPLACEMENTS_REPORT: "ticket.replacements.report",

  // Materiales
  TICKET_MATERIALS_VIEW: "ticket.materials.view",
  TICKET_MATERIALS_REPORT: "ticket.materials.report",
  TICKET_MATERIALS_VALIDATE: "ticket.materials.validate",

  // Responsables
  TICKET_PROVIDER_ASSIGN: "ticket.provider.assign",
  TICKET_CREW_ASSIGN: "ticket.crew.assign",
  TICKET_SUPERVISOR_ASSIGN: "ticket.supervisor.assign",
  TICKET_LEADER_CHANGE: "ticket.leader.change",

  // Sitios
  SITES_VIEW: "sites.view",
  SITES_CREATE: "sites.create",
  SITES_EDIT: "sites.edit",
  SITES_DELETE: "sites.delete",
  SITES_TAG: "sites.tag",

  // Etiquetado
  TAGGING_VIEW: "tagging.view",
  TAGGING_EDIT: "tagging.edit",
  TAGGING_VALIDATE: "tagging.validate",
  TAGGING_DELETE: "tagging.delete",

  // Proyectos
  PROJECTS_VIEW: "projects.view",
  PROJECTS_CREATE: "projects.create",
  PROJECTS_DELETE: "projects.delete",
  PROJECTS_MANAGE: "projects.manage",
  IMPLEMENTATIONS_CREATE: "implementations.create",

  // Usuarios
  USERS_CREATE: "users.create",
  USERS_DEACTIVATE: "users.deactivate",
  USERS_MANAGE: "users.manage",
  NOC_USERS_VIEW: "nocUsers.view",
  PERMISSIONS_MANAGE: "permissions.manage",
  CATALOGS_MANAGE: "catalogs.manage",

  // General
  PROFILE_VIEW: "profile.view",
  DASHBOARD_GRAPH_VIEW: "dashboard.graph.view",
  SUPPORT_METRICS_VIEW: "support.metrics.view",

  //Taskbar
  TICKET_STATUS_CHANGE: "ticket.status.change",
  TICKET_PAUSE: "ticket.pause",
  TICKET_START: "ticket.start",

  TICKET_DEPENDENCIES_MANAGE: "ticket.dependencies.manage",
  TICKET_RELATED_MANAGE: "ticket.related.manage",

  TICKET_INTERVENTIONS_REPORT: "ticket.interventions.report",

  TICKET_REPORT_DOWNLOAD: "ticket.report.download",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
