import { useContext } from "react";

import { PendingNotificationsContext } from "./pendingNotifications.context";

export function usePendingNotifications() {
  const context = useContext(PendingNotificationsContext);

  if (!context) {
    throw new Error(
      "usePendingNotifications must be used within PendingNotificationsProvider",
    );
  }

  return context;
}
