import {
  Building2,
  FolderKanban,
  ListChecks,
  Network,
  Tags,
} from "lucide-react";
import {
  can,
  PERMISSIONS,
  type AuthUser,
  type Permission,
} from "../../../../auth";

interface SidebarTableLink {
  path: string;
  label: string;
  icon: typeof Building2;
  permission: Permission;
}

const TABLE_LINKS: SidebarTableLink[] = [
  {
    path: "/tables/sites",
    label: "Sitios",
    icon: Building2,
    permission: PERMISSIONS.SITES_VIEW,
  },
  {
    path: "/tables/tagged",
    label: "Etiquetados",
    icon: Tags,
    permission: PERMISSIONS.TAGGING_VIEW,
  },
  {
    path: "/tables/projects",
    label: "Proyectos",
    icon: FolderKanban,
    permission: PERMISSIONS.PROJECTS_VIEW,
  },
  {
    path: "/tables/diagnostics",
    label: "Diagnósticos",
    icon: ListChecks,
    permission: PERMISSIONS.CATALOGS_MANAGE,
  },
  {
    path: "/tables/models",
    label: "Marcas y modelos",
    icon: Network,
    permission: PERMISSIONS.CATALOGS_MANAGE,
  },
];

export function getVisibleSidebarTables(user: AuthUser) {
  return TABLE_LINKS.filter(({ permission }) => can(user, permission));
}
