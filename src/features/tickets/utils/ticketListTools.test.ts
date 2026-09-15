import { describe, expect, it } from "vitest";
import { MOCK_TICKETS } from "../config/mockTickets";
import { createInitialTicketFilters, filterTickets } from "./ticketFilters";
import { createTicketListToolsContext } from "./ticketListTools";
import { applyTicketStatusOverrides } from "./ticketStatus";

describe("ticket list tool scope", () => {
  it("preserves the full filter query and IDs from the current list including local status changes", () => {
    const filters = {
      ...createInitialTicketFilters(),
      query: "CAT-10245",
      statuses: ["quotation" as const],
    };
    const tickets = applyTicketStatusOverrides(MOCK_TICKETS, {
      "CAT-10245": "COTIZACION",
    });
    const context = createTicketListToolsContext(
      filters,
      filterTickets(tickets, filters),
    );
    expect(context.ticketIds).toEqual(["CAT-10245"]);
    expect(context.filters).toEqual(filters);
    filters.query = "otro ticket";
    filters.statuses.length = 0;
    expect(context.filters.query).toBe("CAT-10245");
    expect(context.filters.statuses).toEqual(["quotation"]);
  });
});
