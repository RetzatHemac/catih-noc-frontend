import { selectOption } from "../../../../test/selectOption";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CreateTicket } from "./CreateTicket";
import { createTicket } from "../../services/tickets.service";

vi.mock("../../services/tickets.service", () => ({ createTicket: vi.fn() }));
vi.mock("../../../../app/hooks/useNavigation", () => ({
  useNavigation: () => ({ goToPreviousView: vi.fn() }),
}));

function fillForm() {
  for (const [label, option] of [
    ["Proyecto", "Proyecto 3K"],
    ["Sitio", "Sitio Guadalajara"],
    ["Categoría", "Red"],
    ["Tipo de ticket", "Incidente"],
  ] as const) {
    const field = screen.getByLabelText(label, {
      exact: false,
    });
    selectOption(field, option);
  }
  fireEvent.change(screen.getByLabelText("Descripción", { exact: false }), {
    target: { value: "Falla del sitio" },
  });
}

describe("ticket submission feedback", () => {
  it("shows server validation, focuses the alert, keeps data and allows retry", async () => {
    vi.mocked(createTicket)
      .mockReset()
      .mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            message: 'El archivo "foto.png" no contiene una imagen PNG válida.',
          },
        },
      })
      .mockResolvedValueOnce({ id: 1 });
    render(<CreateTicket />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Crear ticket" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      'El archivo "foto.png"',
    );
    await waitFor(() =>
      expect(screen.getByRole("alert").parentElement).toHaveFocus(),
    );
    expect(screen.getByLabelText("Descripción", { exact: false })).toHaveValue(
      "Falla del sitio",
    );
    fireEvent.click(screen.getByRole("button", { name: "Crear ticket" }));
    expect(
      await screen.findByText("El ticket fue enviado correctamente."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
  it("blocks repeated submissions and edits while waiting", async () => {
    let complete!: (value: unknown) => void;
    vi.mocked(createTicket)
      .mockReset()
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            complete = resolve;
          }),
      );
    render(<CreateTicket />);
    fillForm();
    const form = screen
      .getByRole("button", { name: "Crear ticket" })
      .closest("form")!;
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(createTicket).toHaveBeenCalledTimes(1);
    expect(
      screen.getByLabelText("Descripción", { exact: false }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Enviando ticket y archivos",
    );
    await act(async () => complete({ id: 1 }));
    expect(
      screen.getByLabelText("Descripción", { exact: false }),
    ).toBeEnabled();
  });
});
