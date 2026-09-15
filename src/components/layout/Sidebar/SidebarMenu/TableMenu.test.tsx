import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AuthProvider, ROLES, type AuthUser } from "../../../../auth";
import { TableMenu } from "./TableMenu";

const analyst: AuthUser = {
  id: "analyst",
  name: "Analista",
  email: "analista@test.mx",
  role: ROLES.ANALISTA,
};

describe("TableMenu", () => {
  it("shows only tables granted by the session even if the local role has more permissions", () => {
    renderTableMenu({
      ...analyst,
      role: ROLES.SUPER_ADMIN,
      effectivePermissions: ["sites.view"],
    });
    fireEvent.click(screen.getByRole("button", { name: /Tablas/ }));
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Sitios" })).toBeInTheDocument();
  });
  it("expands inline, navigates to a table and closes the containing panel", () => {
    const onNavigate = vi.fn();
    renderTableMenu(analyst, onNavigate);
    const toggle = screen.getByRole("button", { name: /Tablas/ });
    expect(
      screen.queryByRole("link", { name: "Proyectos" }),
    ).not.toBeInTheDocument();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("link", { name: "Proyectos" }));
    expect(screen.getByTestId("location")).toHaveTextContent(
      "/tables/projects",
    );
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("filters table links using effective permissions including overrides", () => {
    renderTableMenu({
      ...analyst,
      permissionOverrides: {
        deny: ["projects.view"],
        grant: ["catalogs.manage"],
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /Tablas/ }));
    expect(
      screen.queryByRole("link", { name: "Proyectos" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sitios" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Etiquetados" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Diagnósticos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Marcas y modelos" }),
    ).toBeInTheDocument();
  });

  it("does not render an empty table group", () => {
    renderTableMenu({ ...analyst, role: ROLES.SOPORTE });
    expect(
      screen.queryByRole("button", { name: /Tablas/ }),
    ).not.toBeInTheDocument();
  });
});

function LocationSnapshot() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}
function renderTableMenu(user: AuthUser, onNavigate = vi.fn()) {
  return render(
    <MemoryRouter>
      <AuthProvider user={user}>
        <TableMenu onNavigate={onNavigate} />
        <LocationSnapshot />
      </AuthProvider>
    </MemoryRouter>,
  );
}
