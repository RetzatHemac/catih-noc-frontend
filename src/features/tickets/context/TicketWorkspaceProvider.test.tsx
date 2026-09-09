import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useTicketWorkspace } from "./useTicketWorkspace";
import { TicketWorkspaceProvider } from "./TicketWorkspaceProvider";
import { mockTicketDetail } from "../mocks/ticketDetail.mock";

describe("TicketWorkspaceProvider", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("automatically clears success feedback after four seconds", () => {
    vi.useFakeTimers();
    render(
      <TicketWorkspaceProvider initialTicket={null}>
        <FeedbackExample />
      </TicketWorkspaceProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Mostrar éxito" }));

    expect(screen.getByRole("status")).toHaveTextContent("Acción completada");

    act(() => vi.advanceTimersByTime(3999));
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("keeps error feedback visible", () => {
    vi.useFakeTimers();
    render(
      <TicketWorkspaceProvider initialTicket={null}>
        <FeedbackExample />
      </TicketWorkspaceProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Mostrar error" }));
    act(() => vi.advanceTimersByTime(8000));

    expect(screen.getByRole("alert")).toHaveTextContent("Ocurrió un error");
  });

  it("reports status changes to the shared ticket list", async () => {
    const onTicketStatusChange = vi.fn();
    render(
      <TicketWorkspaceProvider
        initialTicket={{ ...mockTicketDetail, status: "EN_PROCESO" }}
        onTicketStatusChange={onTicketStatusChange}
      >
        <StatusExample />
      </TicketWorkspaceProvider>,
    );

    await waitFor(() =>
      expect(onTicketStatusChange).toHaveBeenLastCalledWith(
        mockTicketDetail.id,
        "EN_PROCESO",
      ),
    );

    fireEvent.click(screen.getByRole("button", { name: "Cotizar" }));

    await waitFor(() =>
      expect(onTicketStatusChange).toHaveBeenLastCalledWith(
        mockTicketDetail.id,
        "COTIZACION",
      ),
    );
  });
});

function FeedbackExample() {
  const { feedback, setFeedback } = useTicketWorkspace();

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setFeedback({ message: "Acción completada", tone: "success" })
        }
      >
        Mostrar éxito
      </button>
      <button
        type="button"
        onClick={() =>
          setFeedback({ message: "Ocurrió un error", tone: "error" })
        }
      >
        Mostrar error
      </button>

      {feedback && (
        <p role={feedback.tone === "error" ? "alert" : "status"}>
          {feedback.message}
        </p>
      )}
    </>
  );
}

function StatusExample() {
  const { updateTicket } = useTicketWorkspace();

  return (
    <button
      type="button"
      onClick={() =>
        updateTicket((current) => ({ ...current, status: "COTIZACION" }))
      }
    >
      Cotizar
    </button>
  );
}
