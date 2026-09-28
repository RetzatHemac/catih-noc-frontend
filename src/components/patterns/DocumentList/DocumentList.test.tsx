import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DocumentList } from "./DocumentList";

afterEach(() => vi.unstubAllGlobals());

describe("DocumentList", () => {
  it("opens PDF and DOCX in separate tabs and leaves legacy DOC and archives download-only", () => {
    render(
      <DocumentList
        getWordViewUrl={(doc) => `/documents/${doc.id}/view`}
        documents={[
          {
            id: "pdf",
            name: "reporte.pdf",
            mimeType: "application/pdf",
            url: "/reporte.pdf",
          },
          {
            id: "docx",
            name: "reporte.docx",
            mimeType: "",
            url: "/reporte.docx",
          },
          {
            id: "doc",
            name: "antiguo.doc",
            mimeType: "application/msword",
            url: "/antiguo.doc",
          },
          {
            id: "zip",
            name: "respaldo.zip",
            mimeType: "application/zip",
            url: "/respaldo.zip",
          },
        ]}
      />,
    );
    const pdf = screen.getByRole("link", {
      name: "Abrir reporte.pdf en una pestaña nueva",
    });
    expect(pdf).toHaveAttribute("href", "/reporte.pdf");
    expect(pdf).toHaveAttribute("target", "_blank");
    expect(pdf).toHaveAttribute("rel", "noopener noreferrer");
    expect(pdf).not.toHaveAttribute("download");
    expect(
      screen.getByRole("link", {
        name: "Abrir reporte.docx en una pestaña nueva",
      }),
    ).toHaveAttribute("href", "/documents/docx/view");
    expect(
      screen.queryByRole("link", {
        name: "Abrir antiguo.doc en una pestaña nueva",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Descargar antiguo.doc" }),
    ).toHaveAttribute("download");
    expect(
      screen.queryByRole("link", { name: /Abrir respaldo/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Descargar respaldo.zip" }),
    ).toHaveAttribute("download");
  });
  it("shows an empty state", () => {
    render(<DocumentList documents={[]} />);
    expect(screen.getByText("Sin documentación adjunta.")).toBeInTheDocument();
  });
  it("previews an image and keeps spreadsheets, archives and HTML download-only", () => {
    render(
      <DocumentList
        documents={[
          {
            id: "img",
            name: "sitio.jpg",
            url: "/sitio.jpg",
            mimeType: "image/jpeg",
          },
          ...["xlsx", "zip", "html"].map((ext) => ({
            id: ext,
            name: `archivo.${ext}`,
            url: `/archivo.${ext}`,
            mimeType: ext === "html" ? "text/html" : "",
            size: 50,
          })),
        ]}
      />,
    );
    expect(screen.getAllByRole("button", { name: /^Ver / })).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "Descargar archivo.zip" }),
    ).toHaveAttribute("download", "archivo.zip");
    fireEvent.click(screen.getByRole("button", { name: "Ver sitio.jpg" }));
    expect(
      screen.getByRole("dialog", { name: "sitio.jpg" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/sitio.jpg");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("renders text as text, without interpreting HTML", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<script>alert("test")</script>'),
      }),
    );
    render(
      <DocumentList
        documents={[
          {
            id: "txt",
            name: "notas.txt",
            url: "/notas.txt",
            mimeType: "text/plain",
            size: 100,
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Ver notas.txt" }));
    expect(
      await screen.findByText('<script>alert("test")</script>'),
    ).toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
  });
  it("keeps download available when preview fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(
      <DocumentList
        documents={[
          {
            id: "txt",
            name: "notas.txt",
            url: "/notas.txt",
            mimeType: "text/plain",
            size: 100,
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Ver notas.txt" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo cargar",
    );
    expect(
      screen.getByRole("link", { name: "Descargar archivo" }),
    ).toHaveAttribute("href", "/notas.txt");
  });
});
