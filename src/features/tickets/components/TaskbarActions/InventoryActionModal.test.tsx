import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { InventoryActionModal } from "./InventoryActionModal";

describe("InventoryActionModal", () => {
  it("resolves the complete manual inventory cascade", () => {
    const onSubmit = vi.fn();

    render(
      <InventoryActionModal onClose={() => undefined} onSubmit={onSubmit} />,
    );

    fireEvent.change(screen.getByRole("combobox", { name: "Serie dañada" }), {
      target: { value: "manual" },
    });
    fireEvent.change(
      screen.getByRole("textbox", {
        name: "Número de serie del equipo dañado",
      }),
      {
        target: { value: "D-001" },
      },
    );
    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Marca y modelo del equipo dañado",
      }),
      { target: { value: "manual" } },
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Marca del equipo dañado" }),
      {
        target: { value: "Marca D" },
      },
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Modelo del equipo dañado" }),
      {
        target: { value: "Modelo D" },
      },
    );

    fireEvent.change(
      screen.getByRole("combobox", { name: "Serie de reemplazo" }),
      {
        target: { value: "manual" },
      },
    );
    fireEvent.change(
      screen.getByRole("textbox", {
        name: "Número de serie del equipo de reemplazo",
      }),
      {
        target: { value: "R-001" },
      },
    );
    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Marca y modelo del equipo de reemplazo",
      }),
      { target: { value: "manual" } },
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Marca del equipo de reemplazo" }),
      {
        target: { value: "Marca R" },
      },
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Modelo del equipo de reemplazo" }),
      {
        target: { value: "Modelo R" },
      },
    );
    fireEvent.change(screen.getByRole("combobox", { name: "Observación" }), {
      target: { value: "Equipo nuevo instalado y funcionando" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Registrar inventario" }),
    );

    expect(onSubmit).toHaveBeenCalledWith({
      damagedBrand: "Marca D",
      damagedModel: "Modelo D",
      damagedSerial: "D-001",
      replacementBrand: "Marca R",
      replacementModel: "Modelo R",
      replacementSerial: "R-001",
      observations: "Equipo nuevo instalado y funcionando",
    });
  });
});
