import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ThemeContext } from "../../../../app/contexts/theme.context";
import { AuthProvider, ROLES, type AuthUser } from "../../../../auth";
import { PendingNotificationsProvider } from "../../../../features/tickets/context/PendingNotificationsProvider";
import { SidebarFooter } from "./SidebarFooter";

const analyst: AuthUser = {
  id: "analyst-1",
  name: "Analista de prueba",
  email: "analista@prueba.mx",
  role: ROLES.ANALISTA,
};
const agentePgh: AuthUser = { ...analyst, role: ROLES.AGENTE_PGH };

describe("SidebarFooter", () => {
  it("keeps six direct shortcuts for an authorized user and moves secondary actions out", () => {
    renderFooter({ user: { ...analyst, role: ROLES.SUPER_ADMIN } });
    const footer = screen.getByRole("contentinfo", { name: "Accesos rápidos" });
    expect(within(footer).getAllByRole("button")).toHaveLength(6);
    for (const name of [
      "Desplegar menú",
      "Herramientas conexión",
      "Perfil",
      "Modo oscuro",
      "Salir",
    ]) {
      expect(within(footer).getByRole("button", { name })).toBeInTheDocument();
    }
    expect(
      within(footer).queryByRole("button", {
        name: /NOC Online|Liberar cuadrilla|Reportes|Tablas|Más acciones/,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Herramientas conexión" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Salir" })).toBeDisabled();
  });

  it("changes theme directly from the footer", () => {
    const toggleTheme = vi.fn();
    renderFooter({ toggleTheme });
    fireEvent.click(screen.getByRole("button", { name: "Modo oscuro" }));
    expect(toggleTheme).toHaveBeenCalledOnce();
  });

  it("opens the profile through its direct shortcut", () => {
    const onNavigate = vi.fn();
    renderFooter({ onNavigate });
    fireEvent.click(screen.getByRole("button", { name: "Perfil" }));
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(screen.getByTestId("location")).toHaveTextContent("/profile");
  });

  it("requests the panel from its disclosure button", () => {
    const onToggleMenu = vi.fn();
    renderFooter({ onToggleMenu });
    const toggle = screen.getByRole("button", { name: "Desplegar menú" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "sidebar-menu");
    fireEvent.click(toggle);
    expect(onToggleMenu).toHaveBeenCalledOnce();
  });

  it("requests the ticket list without clearing the unread badge", () => {
    const onPendingClick = vi.fn();
    renderFooter({ user: agentePgh, onPendingClick });
    fireEvent.click(
      screen.getByRole("button", { name: "Pendientes: 1 sin leer" }),
    );
    expect(onPendingClick).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("button", { name: "Pendientes: 1 sin leer" }),
    ).toBeInTheDocument();
  });

  it("respects denied permissions for pending notifications and profile", () => {
    renderFooter({
      user: {
        ...agentePgh,
        permissionOverrides: { deny: ["ticket.pending.view", "profile.view"] },
      },
    });
    expect(
      screen.queryByRole("button", { name: /Pendientes|Perfil/ }),
    ).not.toBeInTheDocument();
  });
});

function LocationSnapshot() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}

function renderFooter({
  user = analyst,
  toggleTheme = vi.fn(),
  onPendingClick = vi.fn(),
  onToggleMenu = vi.fn(),
  onNavigate = vi.fn(),
}: {
  user?: AuthUser;
  toggleTheme?: () => void;
  onPendingClick?: () => void;
  onToggleMenu?: () => void;
  onNavigate?: () => void;
} = {}) {
  return render(
    <MemoryRouter>
      <LocationSnapshot />
      <AuthProvider user={user}>
        <ThemeContext.Provider
          value={{ theme: "light", setTheme: vi.fn(), toggleTheme }}
        >
          <PendingNotificationsProvider>
            <SidebarFooter
              onPendingClick={onPendingClick}
              menuOpen={false}
              menuId="sidebar-menu"
              menuButtonRef={{ current: null }}
              onToggleMenu={onToggleMenu}
              onNavigate={onNavigate}
            />
          </PendingNotificationsProvider>
        </ThemeContext.Provider>
      </AuthProvider>
    </MemoryRouter>,
  );
}
