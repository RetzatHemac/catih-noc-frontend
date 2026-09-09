import { describe, expect, it } from "vitest";

import { MOCK_SITES } from "../mocks/sites.mock";
import { filterSites, paginateSites } from "./siteTable";

describe("site table utilities", () => {
  it("does not expose sites until a project is selected", () => {
    expect(filterSites(MOCK_SITES, "", "")).toEqual([]);
  });

  it("filters within the selected project by name or municipality", () => {
    const projectSites = filterSites(MOCK_SITES, "project-1", "");
    expect(projectSites).toHaveLength(14);
    expect(filterSites(MOCK_SITES, "project-1", "guadalajara")).toHaveLength(2);
    expect(filterSites(MOCK_SITES, "project-1", "sitio zapopan")).toHaveLength(
      2,
    );
  });

  it("paginates the selected project", () => {
    const projectSites = filterSites(MOCK_SITES, "project-1", "");
    expect(paginateSites(projectSites, 2, 10)).toHaveLength(4);
  });
});
