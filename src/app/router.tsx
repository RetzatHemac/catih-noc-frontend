import { createBrowserRouter } from "react-router-dom";

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

import { CreateTicket } from "../features/tickets/components/CreateTicket/CreateTicket";

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
        path: "profile",
        element: <div>Profile</div>,
        handle: {
          title: "Perfil",
          description: "Consulta y administra tu información.",
          icon: User,
        } satisfies DetailRouteHandle,
      },

      {
        path: "tables/sites",
        element: <div>Sites</div>,
        handle: {
          title: "Sitios",
          description: "Consulta y administra los sitios registrados.",
          icon: MapPin,
        } satisfies DetailRouteHandle,
      },

      {
        path: "tables/tagged",
        element: <div>Tagged</div>,
        handle: {
          title: "Etiquetados",
          icon: Tags,
        } satisfies DetailRouteHandle,
      },

      {
        path: "tables/projects",
        element: <div>Projects</div>,
        handle: {
          title: "Proyectos",
          icon: FolderKanban,
        } satisfies DetailRouteHandle,
      },

      {
        path: "tables/diagnostics",
        element: <div>Diagnostics</div>,
        handle: {
          title: "Diagnósticos",
          icon: MonitorCog,
        } satisfies DetailRouteHandle,
      },

      {
        path: "tables/models",
        element: <div>Models</div>,
        handle: {
          title: "Marcas y modelos",
          icon: LayoutList,
        } satisfies DetailRouteHandle,
      },
    ],
  },
]);
