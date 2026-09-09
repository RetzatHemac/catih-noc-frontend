import type { SiteImage, SiteRecord } from "../types/site.types";

export function downloadSitesReport(sites: SiteRecord[], projectName: string) {
  const rows = [
    [
      "Código",
      "Nombre",
      "Latitud",
      "Longitud",
      "Dirección",
      "Municipio",
      "Estado",
    ],
    ...sites.map((site) => [
      site.code,
      site.name,
      String(site.latitude),
      String(site.longitude),
      site.address,
      site.municipality,
      site.state,
    ]),
  ];
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","),
    )
    .join("\r\n");

  downloadBlob(
    new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
    `sitios-${slug(projectName)}.csv`,
  );
}

export function downloadSiteProtocol(site: SiteRecord) {
  const html = `
    <html><head><meta charset="utf-8"></head><body>
      <h1>Protocolo de sitio ${escapeHtml(site.code)}</h1>
      <p><strong>Proyecto:</strong> ${escapeHtml(site.projectName)}</p>
      <p><strong>Sitio:</strong> ${escapeHtml(site.name)}</p>
      <p><strong>Dirección:</strong> ${escapeHtml(site.address)}</p>
      <p><strong>Descripción:</strong> ${escapeHtml(site.inventory.description || "Sin descripción")}</p>
      <p><strong>Observaciones:</strong> ${escapeHtml(site.inventory.observations || "Sin observaciones")}</p>
    </body></html>`;

  downloadBlob(
    new Blob([html], { type: "application/msword;charset=utf-8" }),
    `protocolo-${site.code}.doc`,
  );
}

export async function downloadSiteImages(
  site: SiteRecord,
  group?: SiteImage["group"],
) {
  const selectedImages = group
    ? site.inventory.images.filter((image) => image.group === group)
    : site.inventory.images;
  const files = await Promise.all(
    selectedImages.map(async (image, index) => {
      const response = await fetch(image.url);
      if (!response.ok) throw new Error(`No se pudo descargar ${image.url}`);
      return {
        name: `${site.code}-${index + 1}.${extension(image.url)}`,
        data: new Uint8Array(await response.arrayBuffer()),
      };
    }),
  );

  downloadBlob(
    createStoredZip(files),
    `${group === "replacement" ? "reemplazos" : "imagenes"}-${site.code}.zip`,
  );
}

function createStoredZip(files: { name: string; data: Uint8Array }[]): Blob {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  files.forEach((file) => {
    const name = encoder.encode(file.name);
    const checksum = crc32(file.data);
    const local = new Uint8Array(30 + name.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint32(14, checksum, true);
    localView.setUint32(18, file.data.length, true);
    localView.setUint32(22, file.data.length, true);
    localView.setUint16(26, name.length, true);
    local.set(name, 30);
    localParts.push(local, file.data);

    const central = new Uint8Array(46 + name.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint32(16, checksum, true);
    centralView.setUint32(20, file.data.length, true);
    centralView.setUint32(24, file.data.length, true);
    centralView.setUint16(28, name.length, true);
    centralView.setUint32(42, offset, true);
    central.set(name, 46);
    centralParts.push(central);
    offset += local.length + file.data.length;
  });

  const centralDirectory = concatenate(centralParts);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralDirectory.length, true);
  endView.setUint32(16, offset, true);
  const archive = concatenate([...localParts, centralDirectory, end]);

  return new Blob([archive.buffer], { type: "application/zip" });
}

function concatenate(parts: Uint8Array[]) {
  const result = new Uint8Array(
    parts.reduce((size, part) => size + part.length, 0),
  );
  let offset = 0;
  parts.forEach((part) => {
    result.set(part, offset);
    offset += part.length;
  });
  return result;
}

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function extension(url: string) {
  return url.split(".").at(-1)?.split(/[?#]/)[0] || "jpg";
}

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character] ?? character;
  });
}
