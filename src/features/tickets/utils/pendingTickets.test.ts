import { describe, expect, it } from "vitest";

import { MOCK_TICKETS } from "../config/mockTickets";
import type { PendingTicketNotification } from "../types/pendingTicketNotification.types";

import { getUnreadPendingTickets } from "./pendingTickets";

describe("getUnreadPendingTickets", () => {
  it("returns only unread notifications for assigned tickets", () => {
    const notifications: PendingTicketNotification[] = [
      {
        id: "unread-assigned",
        ticketId: "CAT-10244",
        notifiedAt: "2026-09-04T10:00:00-06:00",
        read: false,
      },
      {
        id: "read-assigned",
        ticketId: "CAT-10244",
        notifiedAt: "2026-09-04T09:00:00-06:00",
        read: true,
      },
      {
        id: "unread-created",
        ticketId: "CAT-10245",
        notifiedAt: "2026-09-04T08:00:00-06:00",
        read: false,
      },
    ];

    expect(getUnreadPendingTickets(MOCK_TICKETS, notifications)).toHaveLength(
      1,
    );
  });
});
