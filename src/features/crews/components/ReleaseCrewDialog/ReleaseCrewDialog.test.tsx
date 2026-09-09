import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MOCK_RELEASABLE_CREWS } from "../../mocks/releasableCrews.mock";

import { ReleaseCrewDialog } from "./ReleaseCrewDialog";

describe("ReleaseCrewDialog", () => {
  it("requires a crew and submits its stable identifier", () => {
    const onRelease = vi.fn();
    const crew = MOCK_RELEASABLE_CREWS[0];
    if (!crew) throw new Error("No releasable crew configured");

    render(
      <ReleaseCrewDialog
        crews={MOCK_RELEASABLE_CREWS}
        onClose={() => undefined}
        onRelease={onRelease}
      />,
    );

    const releaseButton = screen.getByRole("button", { name: "Liberar" });
    expect(releaseButton).toBeDisabled();

    fireEvent.change(screen.getByRole("combobox", { name: "Cuadrilla" }), {
      target: { value: crew.id },
    });
    fireEvent.click(releaseButton);

    expect(onRelease).toHaveBeenCalledWith(crew.id);
  });
});
