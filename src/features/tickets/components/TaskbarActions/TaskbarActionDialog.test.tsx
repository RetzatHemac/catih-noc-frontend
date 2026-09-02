import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AuthProvider } from "../../../../auth";
import { mockTicketDetail } from "../../mocks/ticketDetail.mock";
import { TicketWorkspaceProvider } from "../../context/TicketWorkspaceProvider";
import { useTicketWorkspace } from "../../context/useTicketWorkspace";

import { TaskbarActionDialog } from "./TaskbarActionDialog";

describe("TaskbarActionDialog", () => {
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
          <TaskbarActionDialog actionId="pause-ticket" onClose={onClose} />
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
