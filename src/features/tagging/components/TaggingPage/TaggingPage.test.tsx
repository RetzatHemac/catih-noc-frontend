import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AuthProvider } from "../../../../auth";
import { TaggingPage } from "./TaggingPage";

describe("TaggingPage", () => {
  it("filters and paginates tagged equipment", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByText("26 equipos")).toBeInTheDocument();
    await user.type(
      screen.getByRole("searchbox", { name: "Buscar equipos etiquetados" }),
      "CMET",
    );
    expect(screen.getByText("9 equipos")).toBeInTheDocument();

    await user.clear(
      screen.getByRole("searchbox", { name: "Buscar equipos etiquetados" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Ir a la página siguiente" }),
    );
    expect(screen.getAllByText("AF-00011")).toHaveLength(2);
  });

  it("edits equipment in a prefilled modal", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getAllByRole("button", { name: "Editar AF-00001" })[0]!,
    );
    expect(
      screen.getByRole("dialog", { name: "Datos equipo" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Información de equipo:/)).toHaveTextContent(
      "ISR 4331",
    );
    expect(screen.getByLabelText(/Dimensiones/)).toHaveValue(
      "44 x 445 x 438 mm",
    );

    await user.clear(screen.getByLabelText(/Color/));
    await user.type(screen.getByLabelText(/Color/), "Azul");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(
      screen.queryByRole("dialog", { name: "Datos equipo" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Datos del equipo actualizados correctamente."),
    ).toBeInTheDocument();
  });

  it("asks for confirmation before generating the layout", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Generar layout" }));
    const dialog = screen.getByRole("dialog", { name: "Generar layout" });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText(/26 equipos/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(
      screen.queryByRole("dialog", { name: "Generar layout" }),
    ).not.toBeInTheDocument();
  });
});

function renderPage() {
  return render(
    <AuthProvider>
      <TaggingPage />
    </AuthProvider>,
  );
}
