import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Modal } from "./Modal";

function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir modal
      </button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal accesible"
        footer={<button type="button">Confirmar</button>}
      >
        <button type="button">Acción secundaria</button>
      </Modal>
    </>
  );
}

function ModalFormExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState("");
  const [newValue, setNewValue] = useState("");

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir formulario
      </button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Formulario"
        initialFocusId="current-value"
      >
        <label htmlFor="current-value">Valor actual</label>
        <input
          id="current-value"
          value={currentValue}
          onChange={(event) => setCurrentValue(event.target.value)}
        />

        <label htmlFor="new-value">Valor nuevo</label>
        <input
          id="new-value"
          value={newValue}
          onChange={(event) => setNewValue(event.target.value)}
        />
      </Modal>
    </>
  );
}

describe("Modal", () => {
  it("closes only the topmost modal and restores focus to its parent", async () => {
    function Nested() {
      const [parent, setParent] = useState(true);
      const [child, setChild] = useState(false);
      return (
        <Modal
          open={parent}
          title="Inventario"
          onClose={() => setParent(false)}
        >
          <button onClick={() => setChild(true)}>Ampliar</button>
          <Modal open={child} title="Imagen" onClose={() => setChild(false)}>
            <p>Imagen ampliada</p>
          </Modal>
        </Modal>
      );
    }
    const user = userEvent.setup();
    render(<Nested />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cerrar" })).toHaveFocus(),
    );
    const trigger = screen.getByRole("button", { name: "Ampliar" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "Imagen" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("dialog", { name: "Inventario" }),
    ).toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("moves focus inside and returns it to the trigger when closed", async () => {
    const user = userEvent.setup();
    render(<ModalExample />);

    const trigger = screen.getByRole("button", { name: "Abrir modal" });
    await user.click(trigger);

    const closeButton = screen.getByRole("button", { name: "Cerrar" });
    await waitFor(() => expect(closeButton).toHaveFocus());

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps keyboard focus inside the dialog", async () => {
    const user = userEvent.setup();
    render(<ModalExample />);

    await user.click(screen.getByRole("button", { name: "Abrir modal" }));

    const closeButton = screen.getByRole("button", { name: "Cerrar" });
    const lastButton = screen.getByRole("button", { name: "Confirmar" });
    await waitFor(() => expect(closeButton).toHaveFocus());

    await user.keyboard("{Shift>}{Tab}{/Shift}");

    expect(lastButton).toHaveFocus();
  });

  it("does not restore initial focus while editing a controlled field", async () => {
    const user = userEvent.setup();
    render(<ModalFormExample />);

    await user.click(screen.getByRole("button", { name: "Abrir formulario" }));

    const currentInput = screen.getByLabelText("Valor actual");
    const newInput = screen.getByLabelText("Valor nuevo");
    await waitFor(() => expect(currentInput).toHaveFocus());

    await user.click(newInput);
    await user.type(newInput, "Nuevo valor");

    expect(newInput).toHaveFocus();
    expect(newInput).toHaveValue("Nuevo valor");
    expect(currentInput).toHaveValue("");
  });
});
