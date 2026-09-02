import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActivityList } from "./ActivityList";

const activity = {
  id: "activity-1",
  date: "31/08/2026",
  time: "10:00",
  message: "Actividad de prueba",
};

describe("ActivityList permissions", () => {
  it("allows deletion without exposing the edit action", () => {
    const onDelete = vi.fn();

    render(<ActivityList items={[activity]} onDelete={onDelete} />);

    expect(
      screen.queryByRole("button", { name: "Editar comentario" }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Eliminar comentario" }),
    );

    expect(onDelete).toHaveBeenCalledWith(activity.id);
  });

  it("does not expose edit controls without an edit handler", () => {
    render(<ActivityList items={[activity]} editable />);

    expect(
      screen.queryByRole("button", { name: "Editar comentario" }),
    ).not.toBeInTheDocument();
  });
});
