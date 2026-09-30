import { selectOption } from "../../../../test/selectOption";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CreateTicketForm } from "./CreateTicketForm";

describe("ticket documentation upload", () => {
  it("enforces 45 MB across selections, accepts the exact boundary and frees capacity on removal", async () => {
    render(<CreateTicketForm />);
    const input = screen.getByLabelText("Seleccionar documentación", {
      selector: "input",
    });
    const sizedFile = (name: string, mb: number) => {
      const file = new File(["data"], name);
      Object.defineProperty(file, "size", { value: mb * 1024 * 1024 });
      return file;
    };
    fireEvent.change(input, {
      target: { files: [sizedFile("grande.zip", 46)] },
    });
    expect(screen.getByRole("alert")).toHaveTextContent("45.0 MB en total");
    expect(screen.queryByText("grande.zip")).not.toBeInTheDocument();
    fireEvent.change(input, {
      target: { files: [sizedFile("primero.zip", 30)] },
    });
    expect(screen.getByRole("button", { name: "Crear ticket" })).toBeDisabled();
    await screen.findByText("primero.zip");
    fireEvent.change(input, {
      target: { files: [sizedFile("segundo.pdf", 15)] },
    });
    await screen.findByText("segundo.pdf");
    expect(
      screen.getByText("45.0 MB de 45.0 MB utilizados"),
    ).toBeInTheDocument();
    fireEvent.change(input, {
      target: { files: [sizedFile("tercero.docx", 1)] },
    });
    expect(screen.getByRole("alert")).toHaveTextContent("45.0 MB en total");
    expect(screen.queryByText("tercero.docx")).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Eliminar segundo.pdf" }),
    );
    fireEvent.change(input, {
      target: { files: [sizedFile("tercero.docx", 1)] },
    });
    await screen.findByText("tercero.docx");
    expect(
      screen.getByText("31.0 MB de 45.0 MB utilizados"),
    ).toBeInTheDocument();
  });
  it("keeps three mixed files across selections, allows replacement and submits them separately from the image", async () => {
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
    await screen.findByText("datos.xlsx");
    fireEvent.change(input, { target: { files: files.slice(2) } });
    await screen.findByText("respaldo.zip");
    expect(screen.getByRole("alert")).toHaveTextContent("máximo 3 archivos");
    expect(screen.queryByText("notas.txt")).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Eliminar datos.xlsx" }),
    );
    fireEvent.change(input, { target: { files: [files[3]] } });
    await screen.findByText("notas.txt");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    const image = new File(["image"], "problema.png", { type: "image/png" });
    fireEvent.change(
      screen.getByLabelText("Seleccionar imagen", { selector: "input" }),
      { target: { files: [image] } },
    );
    await screen.findByText("problema.png");
    for (const [label, value] of [
      ["Proyecto", "Proyecto 3K"],
      ["Sitio", "Sitio Guadalajara"],
      ["Categoría", "Red"],
      ["Tipo de ticket", "Incidente"],
      ["Descripción", "Sin enlace"],
    ] as const) {
      const field = screen.getByLabelText(label, { exact: false });
      if (label === "Descripción") {
        fireEvent.change(field, { target: { value } });
      } else {
        selectOption(field, value);
      }
    }
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Crear ticket" }),
      ).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Crear ticket" }));
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        images: [image],
        attachments: [files[0], files[2], files[3]],
      }),
    );
  });
});
