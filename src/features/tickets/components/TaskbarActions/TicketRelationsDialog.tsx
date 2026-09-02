import { useState } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Select } from "../../../../components/ui/Select/Select";
import { MOCK_TICKETS } from "../../config/mockTickets";
import type { RelatedTicket } from "../../types/ticketDetail.types";

import layoutStyles from "./TaskbarActionModal.module.css";
import styles from "./TicketRelationsDialog.module.css";

interface TicketRelationsDialogProps {
  currentTicketId: string;
  relations: RelatedTicket[];
  onClose: () => void;
  onSubmit: (value: Omit<RelatedTicket, "id">) => void;
}

export function TicketRelationsDialog({
  currentTicketId,
  relations,
  onClose,
  onSubmit,
}: TicketRelationsDialogProps) {
  const [relationType, setRelationType] = useState<"parent" | "child">(
    "parent",
  );
  const [ticketId, setTicketId] = useState("");
  const availableTickets = MOCK_TICKETS.filter(
    (ticket) =>
      ticket.id !== currentTicketId &&
      !relations.some((relation) => relation.identifier === ticket.id),
  );
  const selectedTicket = availableTickets.find(
    (ticket) => ticket.id === ticketId,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTicket) return;

    onSubmit({
      identifier: selectedTicket.id,
      problemType:
        selectedTicket.type === "incident" ? "Incidente" : "Solicitud",
      category: selectedTicket.category,
      relationType,
    });
  }

  return (
    <Modal
      open
      title="Tickets padre e hijo"
      onClose={onClose}
      size="lg"
      footer={
        <div className={layoutStyles.footer}>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            type="submit"
            form="ticket-relation-form"
            disabled={!selectedTicket}
          >
            Relacionar ticket
          </Button>
        </div>
      }
    >
      <form
        id="ticket-relation-form"
        className={layoutStyles.form}
        onSubmit={handleSubmit}
      >
        <div className={layoutStyles.grid}>
          <FormField label="Tipo de relación" htmlFor="relation-type" required>
            <Select
              id="relation-type"
              value={relationType}
              options={[
                { value: "parent", label: "Ticket padre" },
                { value: "child", label: "Ticket hijo" },
              ]}
              onChange={(event) =>
                setRelationType(event.target.value as "parent" | "child")
              }
            />
          </FormField>
          <FormField label="Ticket" htmlFor="relation-ticket" required>
            <Select
              id="relation-ticket"
              value={ticketId}
              options={availableTickets.map((ticket) => ({
                value: ticket.id,
                label: `${ticket.id} · ${ticket.site}`,
              }))}
              onChange={(event) => setTicketId(event.target.value)}
            />
          </FormField>
        </div>
      </form>

      <div className={styles.groups}>
        <RelationGroup
          title="Tickets padre"
          items={relations.filter((item) => item.relationType === "parent")}
        />
        <RelationGroup
          title="Tickets hijo"
          items={relations.filter((item) => item.relationType === "child")}
        />
      </div>
    </Modal>
  );
}

function RelationGroup({
  title,
  items,
}: {
  title: string;
  items: RelatedTicket[];
}) {
  return (
    <details className={styles.group} open={items.length <= 4}>
      <summary>
        {title} <span>({items.length})</span>
      </summary>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.identifier}</strong>
              <span>
                {item.category} · {item.problemType}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Sin relaciones.</p>
      )}
    </details>
  );
}
