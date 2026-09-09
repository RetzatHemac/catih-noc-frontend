import { describe, expect, it } from "vitest";

import { MOCK_TAGGED_EQUIPMENT } from "../mocks/taggedEquipment.mock";
import { filterTaggedEquipment, paginateTaggedEquipment } from "./taggingTable";

describe("tagging table utilities", () => {
  it("filters by project name, short name or company without accents", () => {
    expect(
      filterTaggedEquipment(MOCK_TAGGED_EQUIPMENT, "red estatal"),
    ).toHaveLength(9);
    expect(filterTaggedEquipment(MOCK_TAGGED_EQUIPMENT, "cmet")).toHaveLength(
      9,
    );
    expect(
      filterTaggedEquipment(MOCK_TAGGED_EQUIPMENT, "jalisco"),
    ).toHaveLength(17);
  });

  it("paginates equipment", () => {
    expect(paginateTaggedEquipment(MOCK_TAGGED_EQUIPMENT, 1, 10)).toHaveLength(
      10,
    );
    expect(paginateTaggedEquipment(MOCK_TAGGED_EQUIPMENT, 3, 10)).toHaveLength(
      6,
    );
  });
});
