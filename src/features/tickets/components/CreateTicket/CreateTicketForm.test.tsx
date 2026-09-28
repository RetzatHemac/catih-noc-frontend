import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CreateTicketForm } from "./CreateTicketForm";

describe("ticket documentation upload", () => {
  it("keeps three mixed files across selections, allows replacement and submits them separately from the image", () => {
    const submit = vi.fn();
    render(<CreateTicketForm onSubmit={submit} />);
    const input = screen.getByLabelText("Seleccionar documentación", {
      selector: "input",
    });
    const files = [
      new File(["a"], "evidencia.png", { type: "image/png" }),
      new File(["b"], "datos.xlsx"),
      new File(["c"], "respaldo.zip"),
      new File(["d"], "notas.txt"),
    ];
    fireEvent.change(input, { target: { files: files.slice(0, 2) } });
    fireEvent.change(input, { target: { files: files.slice(2) } });
    expect(screen.getByRole("alert")).toHaveTextContent("máximo 3 archivos");
    expect(screen.queryByText("notas.txt")).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Eliminar datos.xlsx" }),
    );
    fireEvent.change(input, { target: { files: [files[3]] } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    const image = new File(["image"], "problema.png", { type: "image/png" });
    fireEvent.change(
      screen.getByLabelText("Seleccionar imagen", { selector: "input" }),
      { target: { files: [image] } },
    );
    for (const [label, value] of [
      ["Proyecto", "project-3k"],
      ["Sitio", "site-gdl"],
      ["Categoría", "network"],
      ["Tipo de ticket", "incident"],
      ["Clasificación", "failure"],
      ["Descripción", "Sin enlace"],
    ] as const) {
      fireEvent.change(screen.getByLabelText(label, { exact: false }), {
        target: { value },
      });
    }
    fireEvent.click(screen.getByRole("button", { name: "Crear ticket" }));
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        images: [image],
        documents: [files[0], files[2], files[3]],
      }),
    );
  });
});
