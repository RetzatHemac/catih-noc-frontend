import { describe, expect, it } from "vitest";

import { getPasswordStrength } from "./passwordStrength";

describe("getPasswordStrength", () => {
  it("scores an empty password as zero", () => {
    expect(getPasswordStrength("")).toEqual({
      score: 0,
      label: "Sin contraseña",
    });
  });

  it("requires the four security criteria for the strongest level", () => {
    expect(getPasswordStrength("Segura#2026")).toEqual({
      score: 4,
      label: "Fuerte",
    });
  });
});
