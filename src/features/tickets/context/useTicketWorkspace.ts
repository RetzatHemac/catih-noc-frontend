import { useContext } from "react";

import { TicketWorkspaceContext } from "./ticketWorkspace.context";

export function useTicketWorkspace() {
  const context = useContext(TicketWorkspaceContext);

  if (!context) {
    throw new Error(
      "useTicketWorkspace must be used inside TicketWorkspaceProvider",
    );
  }

  return context;
}
