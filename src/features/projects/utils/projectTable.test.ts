import { describe, expect, it } from "vitest";

import { MOCK_PROJECTS } from "../mocks/projects.mock";
import { filterProjects, paginateProjects } from "./projectTable";

describe("project table utilities", () => {
  it("searches without accents across the supported project fields", () => {
    expect(
      filterProjects(MOCK_PROJECTS, { query: "renovacion", status: "" }),
    ).toHaveLength(1);
    expect(
      filterProjects(MOCK_PROJECTS, { query: "RE3K", status: "" }),
    ).toHaveLength(1);
    expect(
      filterProjects(MOCK_PROJECTS, { query: "CON-12001", status: "" }),
    ).toHaveLength(1);
    expect(
      filterProjects(MOCK_PROJECTS, { query: "HEMAC", status: "" }).length,
    ).toBeGreaterThan(1);
  });

  it("filters by status and returns only the requested page", () => {
    const active = filterProjects(MOCK_PROJECTS, {
      query: "",
      status: "active",
    });
    expect(active.every((project) => project.status === "active")).toBe(true);
    expect(paginateProjects(MOCK_PROJECTS, 2, 10)).toHaveLength(4);
  });
});
