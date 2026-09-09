import { createContext } from "react";

import type { PendingTicketNotification } from "../types/pendingTicketNotification.types";

export interface PendingNotificationsContextValue {
  notifications: PendingTicketNotification[];
  markAsRead: (notificationId: string) => void;
}

export const PendingNotificationsContext =
  createContext<PendingNotificationsContextValue | null>(null);
