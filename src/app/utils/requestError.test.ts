import { describe, expect, it } from "vitest";
import { getRequestErrorMessage } from "./requestError";

describe("request error messages", () => {
  it.each([400, 422])("preserves validation details for %s", (status) => {
    expect(
      getRequestErrorMessage({
        isAxiosError: true,
        response: {
          status,
          data: {
            message: 'El archivo "foto.png" no contiene una imagen PNG válida.',
          },
        },
      }),
    ).toContain('"foto.png"');
    expect(
      getRequestErrorMessage({
        isAxiosError: true,
        response: {
          status,
          data: { message: ["Selecciona un sitio.", "Reemplaza la imagen."] },
        },
      }),
    ).toBe("Selecciona un sitio.\nReemplaza la imagen.");
  });
  it.each([
    [401, "sesión"],
    [403, "permiso"],
    [413, "tamaño"],
    [415, "formato"],
    [429, "demasiadas"],
    [500, "servidor tuvo un problema"],
    [409, "conflicto"],
  ])("provides an actionable fallback for %s", (status, message) => {
    expect(
      getRequestErrorMessage({
        isAxiosError: true,
        response: { status, data: {} },
      }),
    ).toContain(message);
  });
  it("does not expose technical server bodies", () => {
    expect(
      getRequestErrorMessage({
        isAxiosError: true,
        response: { status: 500, data: { message: "Database password error" } },
      }),
    ).not.toContain("Database");
    expect(
      getRequestErrorMessage({
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: "<html>proxy error</html>" },
        },
      }),
    ).not.toContain("<html>");
  });
  it("explains uncertain outcomes for timeout and network errors", () => {
    expect(
      getRequestErrorMessage({ isAxiosError: true, code: "ECONNABORTED" }),
    ).toContain("antes de volver a enviarlo");
    expect(getRequestErrorMessage({ isAxiosError: true })).toContain(
      "conexión",
    );
    expect(getRequestErrorMessage(new Error("secret"))).not.toContain("secret");
  });
});
