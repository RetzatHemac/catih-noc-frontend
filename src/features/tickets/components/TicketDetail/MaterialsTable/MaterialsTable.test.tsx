import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MaterialsTable } from "./MaterialsTable";

const material = {
  id: "material-1",
  provider: "Proveedor",
  material: "Cable UTP",
  providerQuantity: 2,
  supervisorQuantity: 2,
  unit: "pieza",
  reviewed: false,
  supervisor: "Supervisora",
  comment: "Sin observaciones",
};

describe("MaterialsTable permissions", () => {
  it("shows disabled review controls without validation permission", () => {
    render(<MaterialsTable materials={[material]} onReviewChange={vi.fn()} />);

    expect(
      screen
        .getAllByRole("checkbox", { name: "Revisar Cable UTP" })
        .every((checkbox) => checkbox.hasAttribute("disabled")),
    ).toBe(true);
  });

  it("allows validation when the capability is granted", () => {
    const onReviewChange = vi.fn();

    render(
      <MaterialsTable
        materials={[material]}
        canValidate
        onReviewChange={onReviewChange}
      />,
    );

    const [checkbox] = screen.getAllByRole("checkbox", {
      name: "Revisar Cable UTP",
    });

    if (!checkbox) {
      throw new Error("No se encontró el control de revisión");
    }

    fireEvent.click(checkbox);

    expect(onReviewChange).toHaveBeenCalledWith(material.id, true);
  });
});
