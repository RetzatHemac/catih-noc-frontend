import type { DocumentFile } from "./document.types";

export function documentFormat(document: DocumentFile) {
  const name = document.name.toLowerCase();
  const mime = document.mimeType.toLowerCase().split(";")[0];
  if (/\.(zip|rar|7z|gz|tar|bz2|xz)$/.test(name)) return "archive";
  if (mime === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  )
    return "docx";
  if (mime === "application/msword" || name.endsWith(".doc")) return "doc";
  return "other";
}

export function documentTabUrl(document: DocumentFile, wordViewUrl?: string) {
  switch (documentFormat(document)) {
    case "pdf":
      return document.url;
    case "docx":
      return wordViewUrl;
    default:
      return undefined;
  }
}
