import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AuthProvider, ROLES, type AuthUser } from "../../../../auth";
import { PendingNotificationsProvider } from "../../context/PendingNotificationsProvider";

import { PendingTickets } from "./PendingTickets";

const baseUser: AuthUser = {
  id: "user-test",
  name: "Usuario de prueba",
  email: "usuario@prueba.mx",
  role: ROLES.AGENTE_PGH,
};

describe("PendingTickets", () => {
  it("shows unread assigned tickets to an authorized actor", () => {
    renderPage(baseUser);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getAllByText("CAT-10244")).not.toHaveLength(0);
    expect(
      screen.getAllByRole("link", { name: "Ver ticket" }),
    ).not.toHaveLength(0);
  });

  it("marks a notification as read when its ticket is opened", () => {
    renderPage(baseUser);
    const openTicketLink = screen.getAllByRole("link", {
      name: "Ver ticket",
    })[0];
    if (!openTicketLink) throw new Error("No pending ticket link rendered");

    fireEvent.click(openTicketLink);

    expect(
      screen.getByText("No hay tickets pendientes sin leer."),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole("link", { name: "Ver ticket" })).toHaveLength(
      0,
    );
  });

  it("shows an access error to unauthorized actors", () => {
    renderPage({ ...baseUser, role: ROLES.ANALISTA });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No tienes permiso para consultar tickets pendientes.",
    );
  });
});

function renderPage(user: AuthUser) {
  return render(
    <MemoryRouter>
      <AuthProvider user={user}>
        <PendingNotificationsProvider>
          <PendingTickets />
        </PendingNotificationsProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}
