import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ImageGallery } from "./ImageGallery";

describe("ImageGallery", () => {
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
