import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChatDialog } from "./ChatDialog";
import { ImageUploadActionModal } from "./ImageUploadActionModal";

describe("attachment preparation in ticket dialogs", () => {
  it("blocks chat sending until the selected image is ready", async () => {
    const submit = vi.fn();
    render(
      <ChatDialog
        messages={[]}
        currentUserName="Demo"
        onClose={vi.fn()}
        onSubmit={submit}
      />,
    );
    fireEvent.change(screen.getByLabelText("Mensaje"), {
      target: { value: "Evidencia" },
    });
    const image = new File(["image"], "chat.png", { type: "image/png" });
    fireEvent.change(
      screen.getByLabelText("Seleccionar fotos o videos", {
        selector: "input",
      }),
      { target: { files: [image] } },
    );
    expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
    await screen.findByText("chat.png");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Enviar" })).toBeEnabled(),
    );
    expect(screen.getByRole("status")).toHaveTextContent("listo para adjuntar");
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
    expect(submit).toHaveBeenCalledWith({
      message: "Evidencia",
      files: [image],
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  it("blocks adding group images until they have been read", async () => {
    const submit = vi.fn();
    render(
      <ImageUploadActionModal
        imageGroups={{
          beforeReplacement: [],
          afterReplacement: [],
          beforeCurrent: [],
          afterCurrent: [],
          generalFinding: [],
          closeFinding: [],
        }}
        onClose={vi.fn()}
        onSubmit={submit}
      />,
    );
    const image = new File(["image"], "grupo.png", { type: "image/png" });
    fireEvent.change(
      screen.getByLabelText("Seleccionar archivos", { selector: "input" }),
      { target: { files: [image] } },
    );
    expect(
      screen.getByRole("button", { name: "Agregar imágenes" }),
    ).toBeDisabled();
    await screen.findByText("grupo.png");
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Agregar imágenes" }),
      ).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Agregar imágenes" }));
    expect(submit).toHaveBeenCalledWith({
      group: "beforeReplacement",
      description: "",
      files: [image],
    });
  });
});
