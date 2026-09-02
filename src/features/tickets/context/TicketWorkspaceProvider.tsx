import { useCallback, useMemo, useState, type ReactNode } from "react";

import type { TicketDetail } from "../types/ticketDetail.types";

import {
  TicketWorkspaceContext,
  type TicketFeedback,
} from "./ticketWorkspace.context";

interface TicketWorkspaceProviderProps {
  children: ReactNode;
  initialTicket: TicketDetail | null;
}

export function TicketWorkspaceProvider({
  children,
  initialTicket,
}: TicketWorkspaceProviderProps) {
  const [ticket, setTicket] = useState(initialTicket);
  const [feedback, setFeedback] = useState<TicketFeedback | null>(null);

  const updateTicket = useCallback(
    (updater: (current: TicketDetail) => TicketDetail) => {
      setTicket((current) => (current ? updater(current) : current));
    },
    [],
  );

  const value = useMemo(
    () => ({ ticket, feedback, updateTicket, setFeedback }),
    [ticket, feedback, updateTicket],
  );

  return (
    <TicketWorkspaceContext.Provider value={value}>
      {children}
    </TicketWorkspaceContext.Provider>
  );
}
