import type { TaggedEquipment } from "../types/taggedEquipment.types";

export function downloadTaggingLayout(equipment: TaggedEquipment[]) {
  const rows = [
    ["Id activo fijo", "Serie", "Modelo", "Tipo", "Sitio", "Estatus"],
    ...equipment.map((item) => [
      item.fixedAssetId,
      item.serialNumber,
      item.model,
      item.type,
      item.site,
      item.status,
    ]),
  ];
  const worksheetRows = rows
    .map(
      (row) =>
        `<Row>${row
          .map(
            (cell) =>
              `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`,
          )
          .join("")}</Row>`,
    )
    .join("");
  const workbook = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Etiquetado"><Table>${worksheetRows}</Table></Worksheet></Workbook>`;
  const url = URL.createObjectURL(
    new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" }),
  );
  const link = document.createElement("a");

  link.href = url;
  link.download = "layout-etiquetado.xls";
  link.click();
  URL.revokeObjectURL(url);
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
