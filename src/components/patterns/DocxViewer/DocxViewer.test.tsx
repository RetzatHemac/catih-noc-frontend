import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocxViewer } from "./DocxViewer";

const { renderAsync } = vi.hoisted(() => ({ renderAsync: vi.fn() }));
vi.mock("docx-preview", () => ({ renderAsync }));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("DocxViewer", () => {
  it("renders in an isolated read-only frame and removes document links", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)),
        }),
    );
    renderAsync.mockImplementation(async (_bytes, body: HTMLElement) => {
      body.innerHTML = '<a href="https://example.com">Documento</a>';
    });
    render(<DocxViewer url="/reporte.docx" name="Reporte" />);
    const frame = screen.getByTitle(
      "Vista de solo lectura: Reporte",
    ) as HTMLIFrameElement;
    expect(frame).toHaveAttribute("sandbox", "allow-same-origin");
    expect(frame.getAttribute("srcdoc")).toContain("default-src 'none'");
    fireEvent.load(frame);
    await waitFor(() => expect(renderAsync).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.queryByText("Cargando documento…")).not.toBeInTheDocument(),
    );
    expect(frame.contentDocument?.querySelector("a")).not.toHaveAttribute(
      "href",
    );
    expect(renderAsync).toHaveBeenCalledWith(
      expect.any(ArrayBuffer),
      frame.contentDocument?.body,
      undefined,
      expect.objectContaining({ renderAltChunks: false, useBase64URL: true }),
    );
  });
  it("shows an error instead of an empty viewer when loading fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    render(<DocxViewer url="/missing.docx" name="Reporte" />);
    fireEvent.load(screen.getByTitle("Vista de solo lectura: Reporte"));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo mostrar",
    );
  });
});
