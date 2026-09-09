import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MOCK_NOC_ONLINE_USERS } from "../../mocks/nocOnlineUsers.mock";

import { NocOnlineDialog } from "./NocOnlineDialog";

describe("NocOnlineDialog", () => {
  it("shows active users and closes from its action", () => {
    const onClose = vi.fn();

    render(
      <NocOnlineDialog open users={MOCK_NOC_ONLINE_USERS} onClose={onClose} />,
    );

    expect(
      screen.getByRole("list", { name: "Usuarios NOC activos" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ana Rodríguez")).toBeInTheDocument();
    expect(screen.getAllByText("En línea")).toHaveLength(
      MOCK_NOC_ONLINE_USERS.length,
    );

    fireEvent.click(screen.getByText("Cerrar"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
