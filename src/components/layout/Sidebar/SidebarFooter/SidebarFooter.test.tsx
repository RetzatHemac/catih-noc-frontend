import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ThemeContext } from "../../../../app/contexts/theme.context";
import { AuthProvider, ROLES, type AuthUser } from "../../../../auth";
import { PendingNotificationsProvider } from "../../../../features/tickets/context/PendingNotificationsProvider";
import { PendingTickets } from "../../../../features/tickets/components/PendingTickets/PendingTickets";

import { SidebarFooter } from "./SidebarFooter";

const analyst: AuthUser = {
  id: "analyst-1",
  name: "Analista de prueba",
  email: "analista@prueba.mx",
  role: ROLES.ANALISTA,
};

const agentePgh: AuthUser = {
  ...analyst,
  id: "agent-pgh-1",
  role: ROLES.AGENTE_PGH,
};

describe("SidebarFooter", () => {
  it("shows crew release only to an authorized user and opens its dialog", () => {
    renderFooter();

    expect(
      screen.queryByRole("button", { name: "Ver NOC Online" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Liberar cuadrilla" }));

    expect(
      screen.getByRole("dialog", { name: "Liberar cuadrilla" }),
    ).toBeInTheDocument();
  });

  it("keeps the theme action inside the more menu", () => {
    const toggleTheme = vi.fn();
    renderFooter(toggleTheme);

    expect(
      screen.queryByRole("menuitem", { name: "Modo oscuro" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Más acciones" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Modo oscuro" }));

    expect(toggleTheme).toHaveBeenCalledOnce();
  });

  it("shows the unread pending badge to an authorized NOC user", () => {
    renderFooter(vi.fn(), agentePgh);

    expect(
      screen.getByRole("button", { name: "Pendientes: 1 sin leer" }),
    ).toBeInTheDocument();
  });

  it("removes the badge after opening the pending ticket", () => {
    render(
      <MemoryRouter>
        <AuthProvider user={agentePgh}>
          <ThemeContext.Provider
            value={{ theme: "light", setTheme: vi.fn(), toggleTheme: vi.fn() }}
          >
            <PendingNotificationsProvider>
              <SidebarFooter />
              <PendingTickets />
            </PendingNotificationsProvider>
          </ThemeContext.Provider>
        </AuthProvider>
      </MemoryRouter>,
    );
    const openTicketLink = screen.getAllByRole("link", {
      name: "Ver ticket",
    })[0];
    if (!openTicketLink) throw new Error("No pending ticket link rendered");

    fireEvent.click(openTicketLink);

    expect(
      screen.queryByRole("button", { name: "Pendientes: 1 sin leer" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Pendientes" }),
    ).toBeInTheDocument();
  });
});

function renderFooter(toggleTheme = vi.fn(), user = analyst) {
  return render(
    <MemoryRouter>
      <AuthProvider user={user}>
        <ThemeContext.Provider
          value={{ theme: "light", setTheme: vi.fn(), toggleTheme }}
        >
          <PendingNotificationsProvider>
            <SidebarFooter />
          </PendingNotificationsProvider>
        </ThemeContext.Provider>
      </AuthProvider>
    </MemoryRouter>,
  );
}
