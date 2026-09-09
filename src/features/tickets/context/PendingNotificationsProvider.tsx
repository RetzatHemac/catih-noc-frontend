import { useCallback, useMemo, useState, type ReactNode } from "react";

import { MOCK_PENDING_TICKET_NOTIFICATIONS } from "../mocks/pendingTicketNotifications.mock";
import type { PendingTicketNotification } from "../types/pendingTicketNotification.types";

import { PendingNotificationsContext } from "./pendingNotifications.context";

interface PendingNotificationsProviderProps {
  children: ReactNode;
  initialNotifications?: PendingTicketNotification[];
}

export function PendingNotificationsProvider({
  children,
  initialNotifications = MOCK_PENDING_TICKET_NOTIFICATIONS,
}: PendingNotificationsProviderProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ notifications, markAsRead }),
    [notifications, markAsRead],
  );

  return (
    <PendingNotificationsContext.Provider value={value}>
      {children}
    </PendingNotificationsContext.Provider>
  );
}
