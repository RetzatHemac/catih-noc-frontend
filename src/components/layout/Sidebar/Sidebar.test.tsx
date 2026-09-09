import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ThemeContext } from "../../../app/contexts/theme.context";
import { AuthProvider } from "../../../auth";
import { PendingNotificationsProvider } from "../../../features/tickets/context/PendingNotificationsProvider";

import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("renders a ticket with the status and color updated by the detail", () => {
    renderSidebar("COTIZACION");

    const ticket = screen.getByRole("link", { name: /CAT-10245/ });

    expect(ticket).toHaveTextContent("Cotización");
    expect(ticket).toHaveStyle({
      "--ticket-status": "var(--status-quotation)",
      "--ticket-status-soft": "var(--status-quotation-soft)",
    });
  });

  it("renders the paused status and its colors after pausing a ticket", () => {
    renderSidebar("PAUSADO");

    const ticket = screen.getByRole("link", { name: /CAT-10245/ });

    expect(ticket).toHaveTextContent("Pausado");
    expect(ticket).toHaveStyle({
      "--ticket-status": "var(--status-paused)",
      "--ticket-status-soft": "var(--status-paused-soft)",
    });
  });
});

function renderSidebar(status: "COTIZACION" | "PAUSADO") {
  return render(
    <MemoryRouter initialEntries={["/tickets/CAT-10245"]}>
      <AuthProvider>
        <ThemeContext.Provider
          value={{ theme: "light", setTheme: vi.fn(), toggleTheme: vi.fn() }}
        >
          <PendingNotificationsProvider>
            <Sidebar ticketStatusOverrides={{ "CAT-10245": status }} />
          </PendingNotificationsProvider>
        </ThemeContext.Provider>
      </AuthProvider>
    </MemoryRouter>,
  );
}
