import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AuthProvider } from "../../../../auth";

import { SitesPage } from "./SitesPage";

describe("SitesPage", () => {
  it("waits for a project and then filters and paginates its sites", async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.getAllByText("Selecciona un proyecto")).toHaveLength(2);
    expect(
      screen.queryByRole("navigation", { name: "Paginación de resultados" }),
    ).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Proyecto"), "project-1");
    expect(screen.getByText("14 sitios")).toBeInTheDocument();

    await user.type(
      screen.getByRole("searchbox", { name: "Buscar sitios" }),
      "Guadalajara",
    );
    expect(screen.getByText("2 sitios")).toBeInTheDocument();

    await user.clear(screen.getByRole("searchbox", { name: "Buscar sitios" }));
    await user.click(
      screen.getByRole("button", { name: "Ir a la página siguiente" }),
    );
    expect(screen.getAllByText("SIT-0011")).toHaveLength(2);
  });

  it("edits a site with prefilled fields and returns to its project", async () => {
    const user = userEvent.setup();
    renderPage();
    await selectFirstProject(user);

    await user.click(
      screen.getAllByRole("button", { name: "Editar SIT-0001" })[0]!,
    );
    expect(screen.getByLabelText("Código")).toHaveValue("SIT-0001");
    await user.clear(screen.getByLabelText("Municipio"));
    await user.type(screen.getByLabelText("Municipio"), "Guadalajara Centro");
    await user.click(screen.getByRole("button", { name: "Guardar sitio" }));

    expect(screen.getAllByText("Guadalajara Centro")).toHaveLength(2);
    expect(
      screen.getByText("Sitio actualizado correctamente."),
    ).toBeInTheDocument();
  });

  it("shows passwords and creates and deletes addressing", async () => {
    const user = userEvent.setup();
    renderPage();
    await selectFirstProject(user);

    await user.click(
      screen.getAllByRole("button", { name: "Ver más de SIT-0001" })[0]!,
    );
    expect(screen.getAllByText("Mock#2026").length).toBeGreaterThan(0);
    expect(screen.getAllByText("MockBackup#2026").length).toBeGreaterThan(0);
    await user.click(
      screen.getByRole("button", { name: "Agregar nuevo direccionamiento" }),
    );
    await user.type(screen.getByLabelText(/Dirección IP/), "192.168.1.10");
    await user.type(screen.getByLabelText(/Máscara/), "255.255.255.0");
    await user.type(screen.getByLabelText(/Gateway/), "192.168.1.1");
    await user.click(
      screen.getByRole("button", { name: "Guardar direccionamiento" }),
    );

    expect(screen.getAllByText("192.168.1.10")).toHaveLength(2);
    await user.click(
      screen.getAllByRole("button", {
        name: "Eliminar direccionamiento 192.168.1.10",
      })[0]!,
    );
    await user.click(
      screen.getByRole("button", { name: "Eliminar direccionamiento" }),
    );
    expect(screen.queryByText("192.168.1.10")).not.toBeInTheDocument();
  });

  it("updates inventory status and toggles the inline image gallery", async () => {
    const user = userEvent.setup();
    renderPage();
    await selectFirstProject(user);

    await user.click(
      screen.getAllByRole("button", { name: "Inventario de SIT-0001" })[0]!,
    );
    await user.click(screen.getByRole("button", { name: "Cambiar status" }));
    await user.selectOptions(
      screen.getByLabelText(/Status del inventario/),
      "pending",
    );
    await user.click(screen.getByRole("button", { name: "Guardar" }));
    await user.click(screen.getByRole("button", { name: "Cambiar status" }));
    expect(screen.getByLabelText(/Status del inventario/)).toHaveValue(
      "pending",
    );
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    await user.click(
      screen.getByRole("button", { name: "Ver todas las imágenes" }),
    );
    expect(
      screen.getByLabelText("Imágenes del sitio SIT-0001"),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ocultar imágenes" }));
    expect(
      screen.queryByLabelText("Imágenes del sitio SIT-0001"),
    ).not.toBeInTheDocument();
  });

  it("asks for confirmation before deleting a site", async () => {
    const user = userEvent.setup();
    renderPage();
    await selectFirstProject(user);

    fireEvent.click(
      screen.getAllByRole("button", { name: "Eliminar SIT-0001" })[0]!,
    );
    expect(
      screen.getByRole("dialog", { name: "Eliminar sitio" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Eliminar sitio" }));
    expect(screen.getByText("13 sitios")).toBeInTheDocument();
  });
});

function renderPage() {
  return render(
    <AuthProvider>
      <SitesPage />
    </AuthProvider>,
  );
}

async function selectFirstProject(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText("Proyecto"), "project-1");
}
