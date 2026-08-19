import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell/AppShell";
import { TicketPage } from "../pages/TicketPage/TicketPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/tickets" replace />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: "/tickets",
        element: <TicketPage />, 
      },
    ],
  },
]);
