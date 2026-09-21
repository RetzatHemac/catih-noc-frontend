import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ThemeContext } from "../../../app/contexts/theme.context";
import { AuthProvider, ROLES, type AuthUser } from "../../../auth";
import { PendingNotificationsProvider } from "../../../features/tickets/context/PendingNotificationsProvider";

import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("keeps filters applied when closing the panel and restores focus", () => {
    renderSidebar("COTIZACION");
    const trigger = screen.getByRole("button", { name: "Filtros" });
    fireEvent.click(trigger);
    const panel = screen.getByRole("region", { name: "Filtros de tickets" });
    expect(trigger).toHaveAttribute("aria-controls", panel.id);
    fireEvent.click(within(panel).getByRole("button", { name: "Cotización" }));
    expect(screen.getByRole("link", { name: /CAT-10245/ })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /CAT-10244/ }),
    ).not.toBeInTheDocument();
    fireEvent.keyDown(panel, { key: "Escape" });
    expect(
      screen.queryByRole("region", { name: "Filtros de tickets" }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("link", { name: /CAT-10244/ }),
    ).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(screen.getByRole("button", { name: "Cotización" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Restablecer filtros" }),
    );
    expect(screen.getByRole("link", { name: /CAT-10244/ })).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Filtros de tickets" }),
    ).toBeInTheDocument();
  });
  it("moves the planned tools into the menu and keeps their context aligned with search results", async () => {
    renderSidebar("COTIZACION");
    expect(
      screen.queryByRole("button", { name: /^Herramientas de tickets/ }),
    ).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar ticket" }), {
      target: { value: "Zapopan" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Desplegar menú" }));
    fireEvent.click(
      await screen.findByRole("button", {
        name: /^Herramientas de tickets/,
      }),
    );
    expect(screen.getByText("Zapopan")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^Herramientas de tickets/ }),
    ).toHaveTextContent("1 ticket en la lista");
    for (const name of [
      "Ver mapa",
      "Reporte supervisor",
      "Reporte filtrado",
      "Reporte asignado",
    ]) {
      expect(screen.getByRole("button", { name })).toBeDisabled();
    }

    fireEvent.click(screen.getByRole("button", { name: "Cerrar menú" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar ticket" }), {
      target: { value: "sin-coincidencias" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Desplegar menú" }));
    expect(
      await screen.findByRole("button", {
        name: /^Herramientas de tickets/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "La lista no tiene resultados con los filtros actuales.",
      ),
    ).toBeInTheDocument();
  });

  it("opens a separate panel and preserves search and scroll when closed with Escape", () => {
    renderSidebar("COTIZACION");
    fireEvent.change(screen.getByRole("searchbox", { name: "Buscar ticket" }), {
      target: { value: "Zapopan" },
    });
    const list = screen.getByRole("region", { name: "Tickets" });
    list.scrollTop = 200;
    fireEvent.click(screen.getByRole("button", { name: "Desplegar menú" }));
    expect(screen.getByRole("region", { name: "Menú" })).toBeVisible();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cerrar menú" })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("button", { name: "Cerrar menú" }), {
      key: "Escape",
    });
    expect(
      screen.queryByRole("region", { name: "Menú" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Buscar ticket" }),
    ).toHaveValue("Zapopan");
    expect(list.scrollTop).toBe(200);
    expect(
      screen.getByRole("button", { name: "Desplegar menú" }),
    ).toHaveFocus();
  });

  it("closes the panel from its footer toggle and when navigating to a table", () => {
    renderSidebar("COTIZACION");
    fireEvent.click(screen.getByRole("button", { name: "Desplegar menú" }));
    fireEvent.click(screen.getByRole("button", { name: "Ocultar menú" }));
    expect(
      screen.queryByRole("region", { name: "Menú" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Desplegar menú" }));
    fireEvent.click(screen.getByRole("button", { name: /Tablas/ }));
    fireEvent.click(screen.getByRole("link", { name: "Proyectos" }));
    expect(screen.getByTestId("current-path")).toHaveTextContent(
      "/tables/projects",
    );
    expect(
      screen.queryByRole("region", { name: "Menú" }),
    ).not.toBeInTheDocument();
  });

  it("closes the panel and focuses the list start from Pendientes", async () => {
    renderSidebar("COTIZACION");
    const list = screen.getByRole("region", { name: "Tickets" });
    list.scrollTop = 200;
    fireEvent.click(screen.getByRole("button", { name: "Desplegar menú" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Pendientes: 1 sin leer" }),
    );
    await waitFor(() => expect(list).toHaveFocus());
    expect(list.scrollTop).toBe(0);
    expect(
      screen.queryByRole("region", { name: "Menú" }),
    ).not.toBeInTheDocument();
  });

  it("opens NOC Online from the panel and Escape closes only its modal", async () => {
    const user = userEvent.setup();
    renderSidebar("COTIZACION");
    await user.click(screen.getByRole("button", { name: "Desplegar menú" }));
    const nocButton = screen.getByRole("button", { name: /NOC Online/ });
    await user.click(nocButton);
    expect(
      screen.getByRole("dialog", { name: "NOC Online" }),
    ).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Menú" })).toBeVisible();
    expect(nocButton).toHaveFocus();
  });

  it("shows crew release to an analyst while hiding NOC Online", () => {
    renderSidebar("COTIZACION", "/", {
      id: "analyst",
      name: "Analista",
      email: "analyst@test.mx",
      role: ROLES.ANALISTA,
    });
    fireEvent.click(screen.getByRole("button", { name: "Desplegar menú" }));
    expect(
      screen.queryByRole("button", { name: /NOC Online/ }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Liberar cuadrilla/ }));
    expect(
      screen.getByRole("dialog", { name: "Liberar cuadrilla" }),
    ).toBeInTheDocument();
  });

  it("shows an empty panel when the user has no additional capabilities", () => {
    renderSidebar("COTIZACION", "/", {
      id: "support",
      name: "Soporte",
      email: "support@test.mx",
      role: ROLES.SOPORTE,
      effectivePermissions: [],
    });
    fireEvent.click(screen.getByRole("button", { name: "Desplegar menú" }));
    expect(
      screen.getByText(
        "No hay opciones adicionales disponibles para tu usuario.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /Liberar cuadrilla|NOC Online|Tablas/,
      }),
    ).not.toBeInTheDocument();
  });

  it.each(["/", "/tickets/CAT-10245"])(
    "returns to the list start without changing the route %s or clearing notifications",
    (path) => {
      renderSidebar("COTIZACION", path);
      const list = screen.getByRole("region", { name: "Tickets" });
      list.scrollTop = 500;

      fireEvent.click(
        screen.getByRole("button", { name: "Pendientes: 1 sin leer" }),
      );

      expect(list.scrollTop).toBe(0);
      expect(list).toHaveFocus();
      expect(screen.getByTestId("current-path")).toHaveTextContent(path);
      expect(
        screen.getByRole("button", { name: "Pendientes: 1 sin leer" }),
      ).toBeInTheDocument();

      list.scrollTop = 300;
      fireEvent.click(
        screen.getByRole("button", { name: "Pendientes: 1 sin leer" }),
      );
      expect(list.scrollTop).toBe(0);
    },
  );

  it("renders a ticket with the status and color updated by the detail", () => {
    renderSidebar("COTIZACION");

    const ticket = screen.getByRole("link", { name: /CAT-10245/ });

    expect(ticket).toHaveTextContent("Cotización");
    expect(ticket).toHaveStyle({
      "--ticket-status": "var(--status-quotation)",
      "--ticket-status-soft": "var(--status-quotation-soft)",
    });
  });

  it("renders the paused status and its colors after pausing a ticket", () => {
    renderSidebar("PAUSADO");

    const ticket = screen.getByRole("link", { name: /CAT-10245/ });

    expect(ticket).toHaveTextContent("Pausado");
    expect(ticket).toHaveStyle({
      "--ticket-status": "var(--status-paused)",
      "--ticket-status-soft": "var(--status-paused-soft)",
    });
  });
});

function CurrentPath() {
  return <output data-testid="current-path">{useLocation().pathname}</output>;
}

function renderSidebar(
  status: "COTIZACION" | "PAUSADO",
  path = "/tickets/CAT-10245",
  user?: AuthUser,
) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <CurrentPath />
      <AuthProvider user={user}>
        <ThemeContext.Provider
          value={{ theme: "light", setTheme: vi.fn(), toggleTheme: vi.fn() }}
        >
          <PendingNotificationsProvider>
            <Sidebar ticketStatusOverrides={{ "CAT-10245": status }} />
          </PendingNotificationsProvider>
        </ThemeContext.Provider>
      </AuthProvider>
    </MemoryRouter>,
  );
}
