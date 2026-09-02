import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EditableField } from "./EditableField";

describe("EditableField", () => {
  it("gives its editing control an accessible name", () => {
    render(
      <EditableField
        label="Municipio"
        value="Monterrey"
        editable
        onSave={() => undefined}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Editar Municipio" }));

    expect(screen.getByRole("textbox", { name: "Municipio" })).toHaveValue(
      "Monterrey",
    );
  });

  it("normalizes a date-time value when editing", () => {
    render(
      <EditableField
        label="Fecha de resolución"
        value="2026-08-31 10:30"
        editable
        control="datetime-local"
        onSave={() => undefined}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Editar Fecha de resolución" }),
    );

    expect(screen.getByLabelText("Fecha de resolución")).toHaveValue(
      "2026-08-31T10:30",
    );
  });
});
