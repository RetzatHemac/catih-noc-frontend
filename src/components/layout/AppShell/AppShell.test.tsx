import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../../../auth";
import { ThemeContext } from "../../../app/contexts/theme.context";
import { PendingNotificationsProvider } from "../../../features/tickets/context/PendingNotificationsProvider";
import { AppShell } from "./AppShell";

afterEach(() => vi.unstubAllGlobals());

function setup() {
  let desktop = true;
  const listeners = new Set<() => void>();
  vi.stubGlobal("matchMedia", () => ({
    matches: desktop,
    addEventListener: (_: string, listener: () => void) =>
      listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) =>
      listeners.delete(listener),
  }));
  const router = createMemoryRouter([
    {
      path: "/",
      element: <AppShell />,
      children: [
        { index: true, element: <p>Bienvenida</p> },
        { path: "welcome", element: <p>Inicio</p> },
        { path: "tickets/:ticketId", element: <p>Ticket activo</p> },
      ],
    },
  ]);
  render(
    <AuthProvider>
      <ThemeContext.Provider
        value={{ theme: "light", setTheme: vi.fn(), toggleTheme: vi.fn() }}
      >
        <PendingNotificationsProvider>
          <RouterProvider router={router} />
        </PendingNotificationsProvider>
      </ThemeContext.Provider>
    </AuthProvider>,
  );
  return {
    router,
    resize(value: boolean) {
      act(() => {
        desktop = value;
        listeners.forEach((listener) => listener());
      });
    },
  };
}

describe("AppShell sidebar visibility", () => {
  it("preserves the open filters and selection when changing tickets", async () => {
    const { router } = setup();
    fireEvent.click(screen.getByRole("button", { name: "Filtros" }));
    fireEvent.click(screen.getByRole("button", { name: "Creado" }));
    await act(() => router.navigate("/tickets/CAT-10245"));
    expect(
      screen.getByRole("region", { name: "Filtros de tickets" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Creado" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.queryByRole("link", { name: /CAT-10244/ }),
    ).not.toBeInTheDocument();
    await act(() => router.navigate("/tickets/CAT-10243"));
    expect(screen.getByRole("button", { name: "Creado" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
  it("preserves the mounted list, filters and scroll when hiding and restoring", () => {
    setup();
    const search = screen.getByRole("searchbox", { name: "Buscar ticket" });
    fireEvent.change(search, { target: { value: "Zapopan" } });
    const list = screen.getByRole("region", { name: "Tickets" });
    list.scrollTop = 120;
    const toggle = screen.getByRole("button", {
      name: "Ocultar panel lateral",
    });
    const sidebar = document.getElementById(
      toggle.getAttribute("aria-controls")!,
    );
    fireEvent.click(toggle);
    expect(sidebar).not.toBeVisible();
    expect(search).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeVisible();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(
      screen.getByRole("button", { name: "Mostrar panel lateral" }),
    );
    expect(sidebar).toBeVisible();
    expect(search).toHaveValue("Zapopan");
    expect(list.scrollTop).toBe(120);
  });

  it("keeps the desktop choice across ticket routes and restores mobile navigation", async () => {
    const { router, resize } = setup();
    fireEvent.click(
      screen.getByRole("button", { name: "Ocultar panel lateral" }),
    );
    await act(() => router.navigate("/tickets/CAT-10245"));
    expect(
      screen.getByRole("button", { name: "Mostrar panel lateral" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeVisible();
    resize(false);
    expect(
      screen.queryByRole("button", { name: "Mostrar panel lateral" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    await act(() => router.navigate("/"));
    expect(
      screen.getByRole("searchbox", { name: "Buscar ticket" }),
    ).toBeVisible();
    expect(screen.queryByRole("main")).not.toBeInTheDocument();
    resize(true);
    expect(
      screen.getByRole("button", { name: "Mostrar panel lateral" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.getByRole("main")).toBeVisible();
  });
});
