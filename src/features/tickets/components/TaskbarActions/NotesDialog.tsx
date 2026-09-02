import { useEffect, useRef, useState } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Textarea } from "../../../../components/ui/Textarea/Textarea";
import type { TicketNote } from "../../types/ticketDetail.types";

import styles from "./NotesDialog.module.css";

interface NotesDialogProps {
  notes: TicketNote[];
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

export function NotesDialog({ notes, onClose, onSubmit }: NotesDialogProps) {
  const [comment, setComment] = useState("");
  const notesRef = useRef<HTMLDivElement>(null);
  const trimmedComment = comment.trim();

  useEffect(() => {
    const notesContainer = notesRef.current;
    if (notesContainer) notesContainer.scrollTop = notesContainer.scrollHeight;
  }, [notes.length]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedComment) return;

    onSubmit(trimmedComment);
    setComment("");
  }

  return (
    <Modal open title="Notas del ticket" onClose={onClose} size="lg">
      <div className={styles.layout}>
        <div
          ref={notesRef}
          className={styles.notes}
          aria-label="Notas guardadas"
          aria-live="polite"
        >
          {notes.length > 0 ? (
            notes.map((note) => (
              <article key={note.id} className={styles.note}>
                <div className={styles.meta}>
                  <strong>{note.author}</strong>
                  <time>{note.createdAt}</time>
                </div>
                <p>{note.comment}</p>
              </article>
            ))
          ) : (
            <div className={styles.empty}>
              No hay notas todavía. Agrega el primer comentario del ticket.
            </div>
          )}
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <FormField label="Nueva nota" htmlFor="ticket-note" required>
            <Textarea
              id="ticket-note"
              rows={5}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Escribe un comentario interno..."
            />
          </FormField>

          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
            <Button type="submit" variant="primary" disabled={!trimmedComment}>
              Guardar nota
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
