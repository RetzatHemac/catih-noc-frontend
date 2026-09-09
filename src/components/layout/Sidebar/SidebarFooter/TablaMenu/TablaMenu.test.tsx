import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { TableMenu } from "./TablaMenu";

describe("TableMenu", () => {
  it("navigates to the selected table view", () => {
    render(
      <MemoryRouter>
        <TableMenu />
        <LocationSnapshot />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Tablas" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Tabla proyectos" }));

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/tables/projects",
    );
  });
});

function LocationSnapshot() {
  return <span data-testid="location">{useLocation().pathname}</span>;
}
