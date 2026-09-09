import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthProvider, ROLES, type AuthUser } from "../../../../auth";

import { ProfilePage } from "./ProfilePage";

const user: AuthUser = {
  id: "profile-user",
  username: "ana.lopez",
  name: "Ana López",
  email: "ana.lopez@prueba.mx",
  role: ROLES.CLIENTE,
};

describe("ProfilePage", () => {
  it("shows the user information and completes the mocked password change", () => {
    render(
      <AuthProvider user={user}>
        <ProfilePage />
      </AuthProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "Ana López" }),
    ).toBeInTheDocument();
    expect(screen.getByText("ana.lopez")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cambiar contraseña" }));

    fireEvent.change(screen.getByLabelText(/Contraseña actual/), {
      target: { value: "Actual#2025" },
    });
    fireEvent.change(screen.getByLabelText(/Nueva contraseña/), {
      target: { value: "Nueva#2026" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar nueva contraseña/), {
      target: { value: "Nueva#2026" },
    });

    const submitButton = screen.getAllByRole("button", {
      name: "Cambiar contraseña",
    })[1];

    if (!submitButton)
      throw new Error("Password submit button was not rendered");

    fireEvent.click(submitButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "Contraseña actualizada correctamente en el entorno de demostración.",
      ),
    ).toBeInTheDocument();
  });
});
