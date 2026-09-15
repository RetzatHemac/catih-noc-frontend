import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthProvider, PERMISSIONS, ROLES, type Permission } from "../../auth";
import { PermissionGate } from "./PermissionGate";

describe("PermissionGate", () => {
  it.each([true, false])(
    "protects catalog content using session permissions (allowed: %s)",
    (allowed) => {
      const effectivePermissions: Permission[] = allowed
        ? [PERMISSIONS.CATALOGS_MANAGE]
        : [];
      render(
        <AuthProvider
          user={{
            id: "user",
            name: "Usuario",
            email: "user@test.mx",
            role: ROLES.SUPER_ADMIN,
            effectivePermissions,
          }}
        >
          <PermissionGate permission={PERMISSIONS.CATALOGS_MANAGE}>
            <div>Contenido de catálogo</div>
          </PermissionGate>
        </AuthProvider>,
      );
      if (allowed)
        expect(screen.getByText("Contenido de catálogo")).toBeInTheDocument();
      else {
        expect(
          screen.queryByText("Contenido de catálogo"),
        ).not.toBeInTheDocument();
        expect(screen.getByRole("alert")).toHaveTextContent(
          "No tienes permiso",
        );
      }
    },
  );
});
