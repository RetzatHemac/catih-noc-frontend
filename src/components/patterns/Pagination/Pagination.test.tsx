import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("navigates with buttons and a valid typed page", async () => {
    const user = userEvent.setup();
    render(<PaginationExample />);

    await user.click(
      screen.getByRole("button", { name: "Ir a la página siguiente" }),
    );
    expect(
      screen.getByRole("navigation", { name: "Paginación de resultados" }),
    ).toHaveTextContent("Página 2 de 5");

    const pageInput = screen.getByRole("spinbutton", { name: "Página" });
    await user.clear(pageInput);
    await user.type(pageInput, "4{Enter}");

    expect(
      screen.getByRole("navigation", { name: "Paginación de resultados" }),
    ).toHaveTextContent("Página 4 de 5");
  });

  it("rejects a page outside the available range", async () => {
    const user = userEvent.setup();
    render(<PaginationExample />);
    const pageInput = screen.getByRole("spinbutton", { name: "Página" });

    await user.clear(pageInput);
    await user.type(pageInput, "9{Enter}");

    expect(
      screen.getByRole("navigation", { name: "Paginación de resultados" }),
    ).toHaveTextContent("Página 1 de 5");
    expect(pageInput).toHaveValue(1);
  });
});

function PaginationExample() {
  const [page, setPage] = useState(1);
  return <Pagination page={page} totalPages={5} onPageChange={setPage} />;
}
