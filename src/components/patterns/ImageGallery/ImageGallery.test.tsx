import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import userEvent from "@testing-library/user-event";

import { ImageGallery } from "./ImageGallery";

describe("ImageGallery", () => {
  const images = [
    { id: "a", url: "/a.jpg", description: "Primera" },
    { id: "b", url: "/b.jpg", description: "Segunda" },
  ];

  it("opens the selected image with the keyboard and restores focus without changing the carousel", async () => {
    const user = userEvent.setup();
    render(<ImageGallery images={images} />);
    await user.click(screen.getByRole("button", { name: "Imagen siguiente" }));
    const trigger = screen.getByRole("button", { name: "Ampliar imagen" });
    trigger.focus();
    await user.keyboard("{Enter}");
    const dialog = screen.getByRole("dialog", { name: "Vista ampliada" });
    expect(
      within(dialog).getByRole("img", { name: "Segunda" }),
    ).toHaveAttribute("src", "/b.jpg");
    await waitFor(() =>
      expect(
        within(dialog).getByRole("button", { name: "Cerrar" }),
      ).toHaveFocus(),
    );
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(screen.getByText("2 de 2")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Editar descripción de imagen" }),
    ).not.toBeInTheDocument();
  });

  it("cancels drafts and saves only the selected image description", () => {
    const save = vi.fn();
    function Gallery() {
      const [items, setItems] = useState(images);
      return (
        <ImageGallery
          images={items}
          onEditDescription={(id, description) => {
            save(id, description);
            setItems((current) =>
              current.map((image) =>
                image.id === id ? { ...image, description } : image,
              ),
            );
          }}
        />
      );
    }
    render(<Gallery />);
    fireEvent.click(screen.getByRole("button", { name: "Imagen siguiente" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Editar descripción de imagen" }),
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Descripción" }), {
      target: { value: "Borrador" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(save).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", { name: "Editar descripción de imagen" }),
    );
    expect(screen.getByRole("textbox")).toHaveValue("Segunda");
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  Actualizada  " },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Guardar descripción" }),
    );
    expect(save).toHaveBeenCalledWith("b", "Actualizada");
    expect(screen.getByText("Actualizada")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Imagen anterior" }));
    expect(screen.getByText("Primera")).toBeInTheDocument();
  });

  it("removes the editor when editing permission is withdrawn", () => {
    const save = vi.fn();
    const { rerender } = render(
      <ImageGallery images={images} onEditDescription={save} />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Editar descripción de imagen" }),
    );
    rerender(<ImageGallery images={images} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(save).not.toHaveBeenCalled();
  });

  it("closes the viewer when its image disappears", () => {
    const { rerender } = render(<ImageGallery images={images} />);
    fireEvent.click(screen.getByRole("button", { name: "Ampliar imagen" }));
    rerender(<ImageGallery images={[images[1]!]} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("shows an accessible fallback when an image cannot be loaded", () => {
    render(
      <ImageGallery
        images={[
          {
            id: "broken-image",
            url: "/missing-image.jpg",
            description: "Imagen de prueba",
          },
        ]}
      />,
    );

    fireEvent.error(screen.getByRole("img", { name: "Imagen de prueba" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "No se pudo cargar esta imagen.",
    );
  });
});
