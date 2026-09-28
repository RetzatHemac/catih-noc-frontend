import { useParams } from "react-router-dom";
import { getMockTicketDetail } from "../../features/tickets/mocks/ticketDetail.mock";
import { documentFormat } from "../../components/patterns/DocumentList/documentFormat";
import { DocxViewer } from "../../components/patterns/DocxViewer/DocxViewer";
import { StatusMessage } from "../../components/ui/StatusMessage/StatusMessage";
import styles from "./TicketDocumentPage.module.css";

export function TicketDocumentPage() {
  const { ticketId, documentId } = useParams();
  const document = ticketId
    ? getMockTicketDetail(ticketId)?.documents?.find(
        (item) => item.id === documentId,
      )
    : undefined;

  return (
    <main className={styles.page}>
      <header>
        <h1>{document?.name ?? "Documento no disponible"}</h1>
        <p>Solo lectura</p>
      </header>
      {document && documentFormat(document) === "docx" ? (
        <DocxViewer key={document.id} url={document.url} name={document.name} />
      ) : (
        <StatusMessage tone="error">
          No se encontró un documento Word compatible para este ticket.
        </StatusMessage>
      )}
    </main>
  );
}
