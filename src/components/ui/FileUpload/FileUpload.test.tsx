import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FileUpload } from "./FileUpload";

afterEach(() => vi.unstubAllGlobals());

function Uploader({
  disabled = false,
  maxFiles = 3,
}: {
  disabled?: boolean;
  maxFiles?: number;
}) {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <FileUpload
      value={files}
      onChange={setFiles}
      multiple
      maxFiles={maxFiles}
      maxSize={10}
      disabled={disabled}
    />
  );
}

function paste(files: File[]) {
  fireEvent.paste(
    screen.getByRole("button", { name: /Seleccionar archivos/ }),
    {
      clipboardData: {
        items: files.map((file) => ({
          kind: "file",
          type: file.type,
          getAsFile: () => file,
        })),
      },
    },
  );
}

describe("FileUpload clipboard", () => {
  it.each(["captura.png", ""])(
    "uses the same filename for keyboard and button paste (source name: %s)",
    async (name) => {
      const file = new File(["png"], name, { type: "image/png" });
      vi.stubGlobal("navigator", {
        clipboard: {
          read: vi
            .fn()
            .mockResolvedValue([
              { types: ["image/png"], getType: () => Promise.resolve(file) },
            ]),
        },
      });
      render(<Uploader />);
      paste([file]);
      fireEvent.click(
        screen.getByRole("button", { name: "Pegar del portapapeles" }),
      );
      await waitFor(() =>
        expect(screen.getAllByText(name || "image.png")).toHaveLength(2),
      );
    },
  );
  it("pastes over the hovered box without focus, and stops on pointer leave", () => {
    const change = vi.fn();
    const { container } = render(<FileUpload value={[]} onChange={change} />);
    const area = container.querySelector("[data-file-upload]")!;
    const file = new File(["png"], "captura.png", { type: "image/png" });
    const clipboardData = {
      items: [{ kind: "file", type: file.type, getAsFile: () => file }],
    };
    fireEvent.pointerEnter(area);
    fireEvent.paste(document.body, { clipboardData });
    expect(change).toHaveBeenCalledExactlyOnceWith([file]);
    fireEvent.pointerLeave(area);
    fireEvent.paste(document.body, { clipboardData });
    expect(change).toHaveBeenCalledTimes(1);
  });
  it("preserves text-field paste and gives a focused uploader priority over hover", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { container } = render(
      <>
        <textarea aria-label="Descripción" />
        <FileUpload value={[]} onChange={first} label="Primero" />
        <FileUpload value={[]} onChange={second} label="Segundo" />
      </>,
    );
    const file = new File(["png"], "captura.png", { type: "image/png" });
    const clipboardData = {
      items: [{ kind: "file", type: file.type, getAsFile: () => file }],
    };
    fireEvent.pointerEnter(container.querySelector("[data-file-upload]")!);
    expect(
      fireEvent.paste(screen.getByRole("textbox"), { clipboardData }),
    ).toBe(true);
    expect(first).not.toHaveBeenCalled();
    fireEvent.paste(screen.getByRole("button", { name: /Segundo/ }), {
      clipboardData,
    });
    expect(second).toHaveBeenCalledExactlyOnceWith([file]);
    expect(first).not.toHaveBeenCalled();
  });
  it("does not paste into an uploader behind a modal", () => {
    const change = vi.fn();
    const { container } = render(
      <>
        <FileUpload value={[]} onChange={change} />
        <div role="dialog" aria-modal="true" aria-label="Otro diálogo" />
      </>,
    );
    fireEvent.pointerEnter(container.querySelector("[data-file-upload]")!);
    fireEvent.paste(document.body, {
      clipboardData: {
        items: [
          {
            kind: "file",
            type: "image/png",
            getAsFile: () =>
              new File(["png"], "captura.png", { type: "image/png" }),
          },
        ],
      },
    });
    expect(change).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Pegar del portapapeles" }),
    ).toHaveAttribute("title", "Pegar del portapapeles");
  });
  it("adds pasted images to the focused uploader and preserves the combined file limit", () => {
    render(<Uploader maxFiles={2} />);
    const images = ["uno", "dos", "tres"].map(
      (name) => new File([name], `${name}.png`, { type: "image/png" }),
    );
    fireEvent.change(
      screen.getByLabelText("Seleccionar archivos", { selector: "input" }),
      { target: { files: images.slice(0, 1) } },
    );
    paste(images.slice(1));
    expect(screen.getByText("uno.png")).toBeInTheDocument();
    expect(screen.getByText("dos.png")).toBeInTheDocument();
    expect(screen.queryByText("tres.png")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("máximo 2 archivos");
  });
  it("validates pasted MIME and size, and ignores non-image clipboard data", () => {
    render(<Uploader />);
    paste([
      new File(["<svg/>"], "vector.svg", { type: "image/svg+xml" }),
      new File(["12345678901"], "grande.png", { type: "image/png" }),
    ]);
    expect(screen.getByRole("alert")).toHaveTextContent("formato no permitido");
    expect(screen.getByRole("alert")).toHaveTextContent("límite de 10 B");
    expect(screen.queryByText("grande.png")).not.toBeInTheDocument();
    paste([new File(["texto"], "nota.txt", { type: "text/plain" })]);
    expect(screen.queryByText("nota.txt")).not.toBeInTheDocument();
  });
  it("does not read automatically and reads an image only when the button is pressed", async () => {
    const read = vi.fn().mockResolvedValue([
      {
        types: ["image/png"],
        getType: () =>
          Promise.resolve(new Blob(["png"], { type: "image/png" })),
      },
    ]);
    vi.stubGlobal("navigator", { clipboard: { read } });
    render(<Uploader />);
    expect(read).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", { name: "Pegar del portapapeles" }),
    );
    expect(await screen.findByText("image.png")).toBeInTheDocument();
    expect(read).toHaveBeenCalledTimes(1);
  });
  it.each(["denied", "empty", "unsupported"])(
    "explains the fallback when clipboard access is %s",
    async (mode) => {
      const read =
        mode === "unsupported"
          ? undefined
          : mode === "empty"
            ? vi.fn().mockResolvedValue([])
            : vi.fn().mockRejectedValue(new Error("NotAllowed"));
      vi.stubGlobal("navigator", { clipboard: { read } });
      render(<Uploader />);
      fireEvent.click(
        screen.getByRole("button", { name: "Pegar del portapapeles" }),
      );
      expect(await screen.findByRole("alert")).toHaveTextContent(
        mode === "empty" ? "no contiene una imagen" : /Ctrl\+V/,
      );
      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: "Pegar del portapapeles" }),
        ).toBeEnabled(),
      );
    },
  );
  it("does not accept pasted images when disabled", () => {
    const change = vi.fn();
    render(<FileUpload value={[]} onChange={change} disabled />);
    fireEvent.paste(
      screen.getByRole("button", { name: /Seleccionar imagen/ }),
      {
        clipboardData: {
          items: [
            {
              kind: "file",
              type: "image/png",
              getAsFile: () =>
                new File(["png"], "a.png", { type: "image/png" }),
            },
          ],
        },
      },
    );
    expect(change).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Pegar del portapapeles" }),
    ).toBeDisabled();
  });
});
