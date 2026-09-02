import { describe, expect, it } from "vitest";

import { MOCK_TICKETS } from "../config/mockTickets";

import {
  countActiveTicketFilters,
  createInitialTicketFilters,
  filterTickets,
} from "./ticketFilters";

describe("filterTickets", () => {
  it("returns every ticket with the initial filters", () => {
    expect(
      filterTickets(MOCK_TICKETS, createInitialTicketFilters()),
    ).toHaveLength(MOCK_TICKETS.length);
  });

  it("combines statuses as alternatives", () => {
    const filters = createInitialTicketFilters();
    filters.statuses = ["created", "assigned"];

    expect(
      filterTickets(MOCK_TICKETS, filters).map((ticket) => ticket.id),
    ).toEqual(["CAT-10245", "CAT-10244"]);
  });

  it("combines different filter groups", () => {
    const filters = createInitialTicketFilters();
    filters.project = "3k";
    filters.supervisor = "supervisor-1";
    filters.type = "incident";

    expect(
      filterTickets(MOCK_TICKETS, filters).map((ticket) => ticket.id),
    ).toEqual(["CAT-10245", "CAT-10243"]);
  });

  it("searches text without being affected by case or accents", () => {
    const filters = createInitialTicketFilters();
    filters.query = "MARIA";

    expect(
      filterTickets(MOCK_TICKETS, filters).map((ticket) => ticket.id),
    ).toEqual(["CAT-10242"]);
  });

  it("limits results to the selected queue", () => {
    const filters = createInitialTicketFilters();
    filters.queue = "wifi-mundial";

    expect(filterTickets(MOCK_TICKETS, filters)).toHaveLength(3);
  });
});

describe("countActiveTicketFilters", () => {
  it("counts statuses and select values without counting search or queue", () => {
    const filters = createInitialTicketFilters();
    filters.query = "CAT";
    filters.queue = "3k";
    filters.statuses = ["created", "paused"];
    filters.project = "3k";

    expect(countActiveTicketFilters(filters)).toBe(3);
  });
});
