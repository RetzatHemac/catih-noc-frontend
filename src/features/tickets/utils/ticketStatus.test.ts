import { describe, expect, it } from "vitest";

import { MOCK_TICKETS } from "../config/mockTickets";
import {
  applyTicketStatusOverrides,
  toTicketDetailStatus,
  toTicketListStatus,
} from "./ticketStatus";

describe("ticket status mapping", () => {
  it("maps quotation and closed statuses in both representations", () => {
    expect(toTicketListStatus("COTIZACION")).toBe("quotation");
    expect(toTicketListStatus("CERRADO")).toBe("closed");
    expect(toTicketDetailStatus("quotation")).toBe("COTIZACION");
    expect(toTicketDetailStatus("closed")).toBe("CERRADO");
  });

  it("applies detail status changes to sidebar ticket summaries", () => {
    const ticket = MOCK_TICKETS[0];
    if (!ticket) throw new Error("No mock ticket configured");

    const updatedTickets = applyTicketStatusOverrides(MOCK_TICKETS, {
      [ticket.id]: "COTIZACION",
    });

    expect(updatedTickets.find((item) => item.id === ticket.id)?.status).toBe(
      "quotation",
    );
    expect(ticket.status).toBe("created");
  });
});
