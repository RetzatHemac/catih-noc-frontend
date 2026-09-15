import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AuthProvider, ROLES, type Role } from "../../auth";
import { PendingNotificationsProvider } from "../../features/tickets/context/PendingNotificationsProvider";
import { TicketWorkspaceProvider } from "../../features/tickets/context/TicketWorkspaceProvider";
import { usePendingNotifications } from "../../features/tickets/context/usePendingNotifications";
import { getMockTicketDetail } from "../../features/tickets/mocks/ticketDetail.mock";
import { TicketDetailPage } from "./TicketDetailPage";

vi.mock("../../features/tickets/components/TicketDetail/TicketDetail", () => ({
  TicketDetail: () => <div>Detalle del ticket</div>,
}));

function NotificationState() {
  const { notifications } = usePendingNotifications();
  return (
    <div>
      {notifications.map(({ id, read }) => (
        <output key={id} data-testid={id}>
          {read ? "read" : "unread"}
        </output>
      ))}
    </div>
  );
}

describe("TicketDetailPage pending notifications", () => {
  it("marks only the opened ticket as read for an authorized user", () => {
    renderDetail(ROLES.AGENTE_PGH);
    expect(screen.getByTestId("opened-ticket")).toHaveTextContent(/^read$/);
    expect(screen.getByTestId("other-ticket")).toHaveTextContent(/^unread$/);
    expect(screen.getByText("Detalle del ticket")).toBeInTheDocument();
  });

  it("does not change notifications for a user without pending access", () => {
    renderDetail(ROLES.ANALISTA);
    expect(screen.getByTestId("opened-ticket")).toHaveTextContent(/^unread$/);
    expect(screen.getByTestId("other-ticket")).toHaveTextContent(/^unread$/);
  });
});

function renderDetail(role: Role) {
  const ticket = getMockTicketDetail("CAT-10244");
  if (!ticket) throw new Error("Missing assigned mock ticket");

  return render(
    <MemoryRouter initialEntries={["/tickets/CAT-10244"]}>
      <AuthProvider
        user={{
          id: "reader",
          name: "Usuario de prueba",
          email: "reader@test.mx",
          role,
        }}
      >
        <PendingNotificationsProvider
          initialNotifications={[
            {
              id: "opened-ticket",
              ticketId: "CAT-10244",
              read: false,
              notifiedAt: "2026-09-15T10:00:00Z",
            },
            {
              id: "other-ticket",
              ticketId: "CAT-10245",
              read: false,
              notifiedAt: "2026-09-15T10:00:00Z",
            },
          ]}
        >
          <TicketWorkspaceProvider initialTicket={ticket}>
            <TicketDetailPage />
            <NotificationState />
          </TicketWorkspaceProvider>
        </PendingNotificationsProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}
