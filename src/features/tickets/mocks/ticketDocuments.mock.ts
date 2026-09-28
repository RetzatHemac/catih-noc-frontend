import type { TicketDocument } from "../types/ticketDetail.types";

const pdf: TicketDocument = {
  id: "document-demo-pdf",
  name: "Diagnóstico del sitio.pdf",
  mimeType: "application/pdf",
  url: "/mocks/tickets/documentation/diagnostico.pdf",
};
const word: TicketDocument = {
  id: "document-demo-word",
  name: "Reporte de atención.docx",
  mimeType:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  url: "/mocks/tickets/documentation/reporte.docx",
};
const zip: TicketDocument = {
  id: "document-demo-zip",
  name: "Documentación de respaldo.zip",
  mimeType: "application/zip",
  url: "/mocks/tickets/documentation/respaldo.zip",
};
const image: TicketDocument = {
  id: "document-demo-image",
  name: "Evidencia del sitio.jpg",
  mimeType: "image/jpeg",
  url: "/mocks/tickets/img-after-current-001.jpg",
};
const text: TicketDocument = {
  id: "document-demo-text",
  name: "Notas de diagnóstico.txt",
  mimeType: "text/plain",
  url: "/mocks/tickets/documentation/diagnostico.txt",
  size: 145,
};

// Explicit assignments keep demonstrations stable when the list is reordered.
const documentsByTicket: Record<string, TicketDocument[]> = {
  "CAT-10245": [word, pdf],
  "CAT-10244": [zip],
  "CAT-10243": [image, text],
  "CAT-10242": [pdf],
  "CAT-10241": [word],
  "CAT-10240": [image, text, zip],
};

export function getMockTicketDocuments(ticketId: string): TicketDocument[] {
  return (documentsByTicket[ticketId] ?? []).map((document) => ({
    ...document,
  }));
}
