import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TASKBAR_ACTIONS } from "../../../features/tickets/config/taskbarActions";

import { TaskBar } from "./TaskBar";

describe("TaskBar", () => {
  it("renders icon actions with accessible names", () => {
    const onAction = vi.fn();
    const action = TASKBAR_ACTIONS[0];

    if (!action) {
      throw new Error("No taskbar action configured");
    }

    render(<TaskBar actions={[action]} onAction={onAction} />);

    fireEvent.click(screen.getByRole("button", { name: "Abrir chat" }));

    expect(onAction).toHaveBeenCalledWith("open-chat");
  });
});
