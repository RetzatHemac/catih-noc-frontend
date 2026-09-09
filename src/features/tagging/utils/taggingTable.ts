import type { TaggedEquipment } from "../types/taggedEquipment.types";

export function filterTaggedEquipment(
  equipment: TaggedEquipment[],
  query: string,
) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return equipment;

  return equipment.filter((item) =>
    [item.projectName, item.projectShortName, item.company].some((value) =>
      normalize(value).includes(normalizedQuery),
    ),
  );
}

export function paginateTaggedEquipment(
  equipment: TaggedEquipment[],
  page: number,
  pageSize: number,
) {
  return equipment.slice((page - 1) * pageSize, page * pageSize);
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX")
    .trim();
}
