import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { TicketDetail } from "../types/ticketDetail.types";

import {
  TicketWorkspaceContext,
  type TicketFeedback,
} from "./ticketWorkspace.context";

interface TicketWorkspaceProviderProps {
  children: ReactNode;
  initialTicket: TicketDetail | null;
  onTicketStatusChange?: (
    ticketId: TicketDetail["id"],
    status: TicketDetail["status"],
  ) => void;
}

const SUCCESS_FEEDBACK_DURATION_MS = 4000;

export function TicketWorkspaceProvider({
  children,
  initialTicket,
  onTicketStatusChange,
}: TicketWorkspaceProviderProps) {
  const [ticket, setTicket] = useState(initialTicket);
  const [feedback, setFeedback] = useState<TicketFeedback | null>(null);
  const currentTicketId = ticket?.id;
  const currentTicketStatus = ticket?.status;

  const updateTicket = useCallback(
    (updater: (current: TicketDetail) => TicketDetail) => {
      setTicket((current) => (current ? updater(current) : current));
    },
    [],
  );

  useEffect(() => {
    if (currentTicketId && currentTicketStatus) {
      onTicketStatusChange?.(currentTicketId, currentTicketStatus);
    }
  }, [currentTicketId, currentTicketStatus, onTicketStatusChange]);

  useEffect(() => {
    if (feedback?.tone !== "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFeedback((current) => (current === feedback ? null : current));
    }, SUCCESS_FEEDBACK_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

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
