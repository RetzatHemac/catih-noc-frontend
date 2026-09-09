import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { MOCK_TICKETS } from "../../../../../features/tickets/config/mockTickets";

import { TicketCard } from "./TicketCard";

describe("TicketCard", () => {
  it("marks the ticket as current on the first navigation", () => {
    const ticket = MOCK_TICKETS[0];
    if (!ticket) throw new Error("No mock ticket configured");

    render(
      <MemoryRouter initialEntries={["/"]}>
        <TicketCard ticket={ticket} />
      </MemoryRouter>,
    );

    const ticketLink = screen.getByRole("link", {
      name: new RegExp(ticket.id),
    });
    expect(ticketLink).not.toHaveAttribute("aria-current");

    fireEvent.click(ticketLink);

    expect(ticketLink).toHaveAttribute("aria-current", "page");
  });
});
