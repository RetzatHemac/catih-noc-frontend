import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { mockTicketDetail } from "../../../mocks/ticketDetail.mock";

import { TicketDetailHeader } from "./TicketDetailHeader";

const defaultProps = {
  ticket: mockTicketDetail,
  onCopyAuxiliaryText: vi.fn(),
  onStartTicket: vi.fn(),
  onDeleteTicket: vi.fn(),
};

describe("TicketDetailHeader", () => {
  it("shows the start action when the resolved capability allows it", () => {
    render(<TicketDetailHeader {...defaultProps} canStartTicket />);

    expect(
      screen.getByRole("button", { name: "Iniciar ticket" }),
    ).toBeInTheDocument();
  });

  it("hides the start action when the resolved capability denies it", () => {
    render(<TicketDetailHeader {...defaultProps} canStartTicket={false} />);

    expect(
      screen.queryByRole("button", { name: "Iniciar ticket" }),
    ).not.toBeInTheDocument();
  });
});
