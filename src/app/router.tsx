import { createBrowserRouter } from "react-router-dom";
import { PERMISSIONS } from "../auth";
import { PermissionGate } from "./components/PermissionGate";

import {
  ClipboardPlus,
  FolderKanban,
  LayoutList,
  MapPin,
  MonitorCog,
  Tags,
  Ticket,
  User,
} from "lucide-react";

import { AppShell } from "../components/layout/AppShell/AppShell";

import { TicketPage } from "../pages/TicketPage/TicketPage";
import { TicketDetailPage } from "../pages/TicketDetailPage/TicketDetailPage";

import { CreateTicket } from "../features/tickets/components/CreateTicket/CreateTicket";
import { ProfilePage } from "../features/users/components/Profile/ProfilePage";
import { ProjectsPage } from "../features/projects/components/ProjectsPage/ProjectsPage";
import { SitesPage } from "../features/sites/components/SitesPage/SitesPage";
import { TaggingPage } from "../features/tagging/components/TaggingPage/TaggingPage";

import type { DetailRouteHandle } from "./types/route.types";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: null,
      },

      {
        path: "tickets",
        element: <TicketPage />,
        handle: {
          title: "Tickets",
          description: "Consulta y administra los tickets.",
          icon: Ticket,
        } satisfies DetailRouteHandle,
      },

      {
        path: "tickets/new",
        element: <CreateTicket />,
        handle: {
          title: "Crear ticket",
          description: "Registra un nuevo ticket para su atención.",
          icon: ClipboardPlus,
        } satisfies DetailRouteHandle,
      },

      {
        path: "tickets/:ticketId",
        element: <TicketDetailPage />,
        handle: {
          title: "Detalle del ticket",
          description: "Consulta y administra la información del ticket.",
          icon: Ticket,
        } satisfies DetailRouteHandle,
      },

      {
        path: "profile",
        element: <ProfilePage />,
        handle: {
          title: "Perfil",
          description: "Consulta y administra tu información.",
          icon: User,
        } satisfies DetailRouteHandle,
      },

      {
        path: "tables/sites",
        element: <SitesPage />,
        handle: {
          title: "Sitios",
          description: "Consulta y administra los sitios registrados.",
          icon: MapPin,
        } satisfies DetailRouteHandle,
      },

      {
        path: "tables/tagged",
        element: <TaggingPage />,
        handle: {
          title: "Etiquetados",
          description: "Consulta y administra los equipos en etiquetado.",
          icon: Tags,
        } satisfies DetailRouteHandle,
      },

      {
        path: "tables/projects",
        element: <ProjectsPage />,
        handle: {
          title: "Proyectos",
          description: "Consulta y administra proyectos e implementaciones.",
          icon: FolderKanban,
        } satisfies DetailRouteHandle,
      },

      {
        path: "tables/diagnostics",
        element: (
          <PermissionGate permission={PERMISSIONS.CATALOGS_MANAGE}>
            <div>Diagnostics</div>
          </PermissionGate>
        ),
        handle: {
          title: "Diagnósticos",
          icon: MonitorCog,
        } satisfies DetailRouteHandle,
      },

      {
        path: "tables/models",
        element: (
          <PermissionGate permission={PERMISSIONS.CATALOGS_MANAGE}>
            <div>Models</div>
          </PermissionGate>
        ),
        handle: {
          title: "Marcas y modelos",
          icon: LayoutList,
        } satisfies DetailRouteHandle,
      },
    ],
  },
]);
