import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthProvider, mockUser } from "../auth";
import { ThemeContext } from "../app/contexts/theme.context";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("shows the welcome text and branding from the assigned company", () => {
    render(
      <AuthProvider
        user={{
          ...mockUser,
          company: { id: "b", name: "Empresa B", logoUrl: "/b.svg" },
        }}
      >
        <ThemeContext.Provider
          value={{ theme: "light", setTheme: vi.fn(), toggleTheme: vi.fn() }}
        >
          <DashboardPage />
        </ThemeContext.Provider>
      </AuthProvider>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Bienvenido al Centro de Atención en Tecnologías de la Información Hemac",
    );
    expect(
      screen.getByRole("img", { name: "Logo de Empresa B" }),
    ).toHaveAttribute("src", "/b.svg");
    expect(screen.getByText("Empresa B")).toBeInTheDocument();
    expect(screen.queryByText("Imagen de prueba")).not.toBeInTheDocument();
  });
});
