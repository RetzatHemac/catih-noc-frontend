import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NavigationProvider } from "../../../../app/providers/NavigationProvider";
import { SidebarHeader } from "../../../../components/layout/Sidebar/SidebarHeader/SidebarHeader";
import { CreateTicket } from "./CreateTicket";

afterEach(() => vi.unstubAllGlobals());

function setup(path: string, desktop: boolean) {
  vi.stubGlobal("matchMedia", () => ({
    matches: desktop,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <NavigationProvider>
            <SidebarHeader searchQuery="" onSearchQueryChange={vi.fn()} />
            <Outlet />
          </NavigationProvider>
        ),
        children: [
          { index: true, element: <p>Lista</p> },
          { path: "tickets/:id", element: <p>Detalle anterior</p> },
          { path: "tickets/new", element: <CreateTicket /> },
        ],
      },
    ],
    { initialEntries: [path] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe("cancel ticket creation", () => {
  it.each([true, false])(
    "returns to the previous ticket and preserves its query and hash (desktop: %s)",
    async (desktop) => {
      const router = setup(
        "/tickets/CAT-10244?tab=general#description",
        desktop,
      );
      fireEvent.click(screen.getByRole("button", { name: "Crear ticket" }));
      await screen.findByRole("button", { name: "Cancelar" });
      // Clicking the persistent sidebar action again must not replace the origin.
      fireEvent.click(
        screen.getAllByRole("button", { name: "Crear ticket" })[0]!,
      );
      fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
      await screen.findByText("Detalle anterior");
      expect(
        router.state.location.pathname +
          router.state.location.search +
          router.state.location.hash,
      ).toBe("/tickets/CAT-10244?tab=general#description");
    },
  );

  it.each([true, false])(
    "returns to the list on direct entry (desktop: %s)",
    async (desktop) => {
      const router = setup("/tickets/new", desktop);
      fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
      await waitFor(() => expect(router.state.location.pathname).toBe("/"));
    },
  );
});
