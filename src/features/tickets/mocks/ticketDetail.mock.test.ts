import { describe, expect, it } from "vitest";

import { getMockTicketDetail } from "./ticketDetail.mock";

describe("getMockTicketDetail", () => {
  it.each([
    ["CAT-10245", "CREADO"],
    ["CAT-10244", "ASIGNADO"],
    ["CAT-10243", "EN_PROCESO"],
    ["CAT-10242", "PAUSADO"],
    ["CAT-10241", "RESUELTO"],
    ["CAT-10240", "COTIZACION"],
  ] as const)("maps %s to detail status %s", (ticketId, expectedStatus) => {
    expect(getMockTicketDetail(ticketId)?.status).toBe(expectedStatus);
  });

  it("returns undefined for an unknown ticket", () => {
    expect(getMockTicketDetail("UNKNOWN")).toBeUndefined();
  });
});
