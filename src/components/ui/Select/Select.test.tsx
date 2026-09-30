import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";
import { Modal } from "../Modal/Modal";

const options = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "xx", label: "No disponible", disabled: true },
];

describe("Select", () => {
  it("keeps validation messages associated with the search input", () => {
    render(
      <>
        <Select
          aria-label="País"
          options={options}
          aria-invalid
          aria-describedby="country-error"
        />
        <p id="country-error">Selecciona un país</p>
      </>,
    );
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")?.split(" ")).toContain(
      "country-error",
    );
  });
  it("filters without accents, selects an ID with the keyboard and reports no matches", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <Select aria-label="País" options={options} onValueChange={change} />,
    );
    const input = screen.getByRole("combobox", { name: "País" });
    await user.type(input, "mex");
    expect(screen.getByRole("option", { name: "México" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Colombia" }),
    ).not.toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(change).toHaveBeenLastCalledWith("mx");
    await user.type(input, "xyz");
    expect(screen.getByText("Sin coincidencias")).toBeInTheDocument();
    expect(change).toHaveBeenCalledTimes(1);
  });

  it("supports multiple IDs, removing a selection and FormData", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { container } = render(
      <form>
        <Select
          multiple
          name="countries"
          aria-label="Países"
          options={options}
          onValueChange={change}
        />
      </form>,
    );
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.click(screen.getByRole("option", { name: "México" }));
    await user.type(input, "col");
    await user.keyboard("{Enter}");
    expect(change).toHaveBeenLastCalledWith(["mx", "co"]);
    expect(
      new FormData(container.querySelector("form")!).getAll("countries"),
    ).toEqual(["mx", "co"]);
    await user.keyboard("{Backspace}");
    expect(change).toHaveBeenLastCalledWith(["mx"]);
  });

  it("preserves defaults, form reset, required validation and disabled options", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <label htmlFor="country">País</label>
        <Select
          id="country"
          name="country"
          required
          options={options}
          defaultValue="co"
        />
        <button type="reset">Restablecer</button>
      </form>,
    );
    const form = container.querySelector("form")!;
    expect(new FormData(form).get("country")).toBe("co");
    await user.click(screen.getByLabelText("País"));
    const disabled = screen.getByRole("option", { name: "No disponible" });
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    await user.click(disabled);
    expect(new FormData(form).get("country")).toBe("co");
    await user.click(screen.getByRole("option", { name: "México" }));
    expect(new FormData(form).get("country")).toBe("mx");
    await user.click(screen.getByRole("button", { name: "Restablecer" }));
    expect(new FormData(form).get("country")).toBe("co");
    expect(form.checkValidity()).toBe(true);
  });

  it("keeps menu focus inside a modal and Escape closes the menu before the dialog", async () => {
    const user = userEvent.setup();
    const close = vi.fn();
    render(
      <Modal open title="Editar" onClose={close} initialFocusId="modal-country">
        <Select id="modal-country" aria-label="País" options={options} />
      </Modal>,
    );
    await user.click(screen.getByRole("combobox"));
    expect(
      within(screen.getByRole("dialog")).getByRole("listbox"),
    ).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(close).not.toHaveBeenCalled();
    await user.keyboard("{Escape}");
    expect(close).toHaveBeenCalledOnce();
  });

  it("honors controlled resets and cannot change disabled fields", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { rerender } = render(
      <Select
        aria-label="País"
        options={options}
        value="mx"
        onValueChange={change}
      />,
    );
    expect(screen.getByText("México")).toBeInTheDocument();
    rerender(
      <Select
        aria-label="País"
        options={options}
        value=""
        disabled
        onValueChange={change}
      />,
    );
    expect(screen.queryByText("México")).not.toBeInTheDocument();
    expect(screen.getByLabelText("País")).toBeDisabled();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(change).not.toHaveBeenCalled();
    rerender(
      <form>
        <Select name="country" required aria-label="País" options={options} />
      </form>,
    );
    let valid = true;
    act(() => {
      valid = screen.getByRole("combobox").closest("form")!.checkValidity();
    });
    expect(valid).toBe(false);
  });
});
