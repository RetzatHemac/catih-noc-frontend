import { fireEvent, screen } from "@testing-library/react";

/** Select through the public combobox UI, just as a keyboard/mouse user would. */
export function selectOption(input: HTMLElement, label: string | RegExp) {
  fireEvent.keyDown(input, { key: "ArrowDown", code: "ArrowDown" });
  fireEvent.click(screen.getByRole("option", { name: label }));
}
