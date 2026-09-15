import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useState } from "react";

import { AuthProvider, ROLES, type AuthUser } from "../../../../auth";
import type { TaskbarActionId } from "../../config/taskbarActions";
import { mockTicketDetail } from "../../mocks/ticketDetail.mock";
import { TicketWorkspaceProvider } from "../../context/TicketWorkspaceProvider";
import { useTicketWorkspace } from "../../context/useTicketWorkspace";

import { TaskbarActionDialog } from "./TaskbarActionDialog";

describe("TaskbarActionDialog", () => {
  it("rejects a direct action request without the required effective permission", () => {
    const onClose = vi.fn();
    render(
      <AuthProvider
        user={{
          id: "user",
          name: "Usuario",
          email: "user@test.mx",
          role: ROLES.SUPER_ADMIN,
          effectivePermissions: [],
        }}
      >
        <TicketWorkspaceProvider initialTicket={mockTicketDetail}>
          <TaskbarActionDialog actionId="open-chat" onClose={onClose} />
        </TicketWorkspaceProvider>
      </AuthProvider>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("dismisses an open dialog when its session permission is revoked", () => {
    const onClose = vi.fn();
    const user: AuthUser = {
      id: "user",
      name: "Usuario",
      email: "user@test.mx",
      role: ROLES.SUPER_ADMIN,
      effectivePermissions: ["ticket.notes.manage"],
    };
    function content(activeUser: AuthUser) {
      return (
        <AuthProvider user={activeUser}>
          <TicketWorkspaceProvider initialTicket={mockTicketDetail}>
            <TaskbarActionDialog actionId="open-chat" onClose={onClose} />
          </TicketWorkspaceProvider>
        </AuthProvider>
      );
    }
    const { rerender } = render(content(user));
    expect(
      screen.getByRole("dialog", { name: "Chat del ticket" }),
    ).toBeInTheDocument();
    rerender(content({ ...user, effectivePermissions: [] }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("rejects actions which the current ticket status does not allow", () => {
    render(
      <AuthProvider>
        <TicketWorkspaceProvider
          initialTicket={{ ...mockTicketDetail, status: "CERRADO" }}
        >
          <TaskbarActionDialog actionId="pause-ticket" onClose={vi.fn()} />
        </TicketWorkspaceProvider>
      </AuthProvider>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sends a chat message with Enter and keeps the dialog open", () => {
    const onClose = vi.fn();

    render(
      <AuthProvider>
        <TicketWorkspaceProvider initialTicket={mockTicketDetail}>
          <TaskbarActionDialog actionId="open-chat" onClose={onClose} />
          <WorkspaceSnapshot />
        </TicketWorkspaceProvider>
      </AuthProvider>,
    );

    const message = screen.getByRole("textbox", { name: "Mensaje" });
    fireEvent.change(message, {
      target: { value: "Mensaje enviado con Enter" },
    });
    fireEvent.keyDown(message, { key: "Enter" });

    expect(
      screen.getByRole("dialog", { name: "Chat del ticket" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("chat-count")).toHaveTextContent(
      String(mockTicketDetail.chatMessages.length + 1),
    );
    expect(message).toHaveValue("");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("saves a note and keeps the dialog open", () => {
    const onClose = vi.fn();

    render(
      <AuthProvider>
        <TicketWorkspaceProvider initialTicket={mockTicketDetail}>
          <TaskbarActionDialog actionId="manage-notes" onClose={onClose} />
          <WorkspaceSnapshot />
        </TicketWorkspaceProvider>
      </AuthProvider>,
    );

    const note = screen.getByRole("textbox", { name: "Nueva nota" });
    fireEvent.change(note, { target: { value: "Nueva nota de seguimiento" } });
    fireEvent.click(screen.getByRole("button", { name: "Guardar nota" }));

    expect(
      screen.getByRole("dialog", { name: "Notas del ticket" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("notes-count")).toHaveTextContent(
      String(mockTicketDetail.notes.length + 1),
    );
    expect(note).toHaveValue("");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("pauses the shared ticket and records its reason", () => {
    const onClose = vi.fn();

    render(
      <AuthProvider>
        <TicketWorkspaceProvider
          initialTicket={{ ...mockTicketDetail, status: "EN_PROCESO" }}
        >
          <DismissibleAction actionId="pause-ticket" onClose={onClose} />
          <WorkspaceSnapshot />
        </TicketWorkspaceProvider>
      </AuthProvider>,
    );

    fireEvent.change(screen.getByRole("combobox", { name: "Dependencia" }), {
      target: { value: "CLIENTE" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Motivo" }), {
      target: { value: "Sin acceso al sitio" },
    });
    fireEvent.change(
      screen.getByRole("textbox", { name: "Detalle del motivo" }),
      {
        target: { value: "Esperando acceso al sitio" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "Pausar ticket" }));

    expect(screen.getByTestId("workspace-status")).toHaveTextContent("PAUSADO");
    expect(screen.getByTestId("latest-pause")).toHaveTextContent(
      "Esperando acceso al sitio",
    );
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("changes the shared ticket to quotation after confirmation", () => {
    const onClose = vi.fn();

    render(
      <AuthProvider>
        <TicketWorkspaceProvider
          initialTicket={{ ...mockTicketDetail, status: "EN_PROCESO" }}
        >
          <TaskbarActionDialog actionId="quote-ticket" onClose={onClose} />
          <WorkspaceSnapshot />
        </TicketWorkspaceProvider>
      </AuthProvider>,
    );

    expect(
      screen.getByRole("dialog", { name: "Cambiar a cotización" }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Cambiar a cotización" }),
    );

    expect(screen.getByTestId("workspace-status")).toHaveTextContent(
      "COTIZACION",
    );
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("reports an activity in the selected onsite section", () => {
    render(
      <AuthProvider>
        <TicketWorkspaceProvider
          initialTicket={{ ...mockTicketDetail, status: "EN_PROCESO" }}
        >
          <TaskbarActionDialog
            actionId="report-activity"
            onClose={() => undefined}
          />
          <WorkspaceSnapshot />
        </TicketWorkspaceProvider>
      </AuthProvider>,
    );

    fireEvent.change(
      screen.getByRole("combobox", { name: "Tipo de actividad" }),
      { target: { value: "onsite" } },
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Actividad realizada" }),
      { target: { value: "Se revisó el cableado en sitio" } },
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Registrar actividad" }),
    );

    expect(screen.getByTestId("latest-onsite-activity")).toHaveTextContent(
      "Se revisó el cableado en sitio",
    );
  });
});

function DismissibleAction({
  actionId,
  onClose,
}: {
  actionId: TaskbarActionId;
  onClose: () => void;
}) {
  const [activeAction, setActiveAction] = useState<TaskbarActionId | null>(
    actionId,
  );
  return (
    <TaskbarActionDialog
      actionId={activeAction}
      onClose={() => {
        setActiveAction(null);
        onClose();
      }}
    />
  );
}

function WorkspaceSnapshot() {
  const { ticket } = useTicketWorkspace();

  return (
    <div>
      <span data-testid="workspace-status">{ticket?.status}</span>
      <span data-testid="latest-pause">
        {ticket?.pauseReasons.at(-1)?.message}
      </span>
      <span data-testid="latest-onsite-activity">
        {ticket?.onsiteActivities.at(-1)?.message}
      </span>
      <span data-testid="chat-count">{ticket?.chatMessages.length}</span>
      <span data-testid="notes-count">{ticket?.notes.length}</span>
    </div>
  );
}
