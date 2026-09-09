import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AuthProvider } from "../../../../auth";

import { ProjectsPage } from "./ProjectsPage";

describe("ProjectsPage", () => {
  it("filters projects using the search and status controls", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getByText("14 proyectos")).toBeInTheDocument();

    await user.type(
      screen.getByRole("searchbox", { name: "Buscar proyectos" }),
      "WiFi Mundial",
    );

    expect(screen.getByText("1 proyecto")).toBeInTheDocument();
    expect(screen.getAllByText("WiFi Mundial Jalisco")).toHaveLength(2);

    await user.selectOptions(screen.getByLabelText("Estado"), "expired");
    expect(screen.getByText("0 proyectos")).toBeInTheDocument();
  });

  it("opens both creation forms in the detail and returns on cancel", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Nuevo proyecto" }));
    expect(
      screen.getByRole("heading", { name: "Nuevo proyecto" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Coberturas" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    await user.click(
      screen.getByRole("button", { name: "Nueva implementación" }),
    );
    expect(
      screen.getByRole("heading", { name: "Nueva implementación" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Motivos" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(
      screen.getByRole("searchbox", { name: "Buscar proyectos" }),
    ).toBeInTheDocument();
  });

  it("opens an edit form prefilled and asks before deleting", () => {
    renderPage();

    fireEvent.click(
      screen.getAllByRole("button", { name: "Editar Red Estatal 3K" })[0]!,
    );
    expect(screen.getByLabelText(/Nombre del contrato/)).toHaveValue(
      "Red Estatal 3K",
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    fireEvent.click(
      screen.getAllByRole("button", { name: "Eliminar Red Estatal 3K" })[0]!,
    );
    expect(
      screen.getByRole("dialog", { name: "Eliminar proyecto" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Eliminar proyecto" }));

    expect(screen.getByText("13 proyectos")).toBeInTheDocument();
    expect(
      screen.getByText("Proyecto eliminado correctamente."),
    ).toBeInTheDocument();
  });
});

function renderPage() {
  return render(
    <AuthProvider>
      <ProjectsPage />
    </AuthProvider>,
  );
}
