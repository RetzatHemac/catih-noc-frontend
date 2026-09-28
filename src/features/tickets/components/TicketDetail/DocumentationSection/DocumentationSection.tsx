import { DocumentList } from "../../../../../components/patterns/DocumentList/DocumentList";
import type { TicketDocument } from "../../../types/ticketDetail.types";

export function DocumentationSection({
  documents = [],
  ticketId,
}: {
  documents?: TicketDocument[];
  ticketId: string;
}) {
  return (
    <DocumentList
      documents={documents}
      getWordViewUrl={(document) =>
        `/tickets/${encodeURIComponent(ticketId)}/documents/${encodeURIComponent(document.id)}/view`
      }
    />
  );
}
