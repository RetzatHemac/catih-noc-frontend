import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FileUpload } from "../../../../components/ui/FileUpload/FileUpload";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Textarea } from "../../../../components/ui/Textarea/Textarea";
import type { TicketMessage } from "../../types/ticketDetail.types";

import styles from "./ChatDialog.module.css";

export interface ChatMessageFormValue {
  message: string;
  files: File[];
}

interface ChatDialogProps {
  messages: TicketMessage[];
  currentUserName: string;
  onClose: () => void;
  onSubmit: (value: ChatMessageFormValue) => void;
}

export function ChatDialog({
  messages,
  currentUserName,
  onClose,
  onSubmit,
}: ChatDialogProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const historyRef = useRef<HTMLDivElement>(null);
  const canSubmit = Boolean(message.trim() || files.length > 0);

  useEffect(() => {
    const history = historyRef.current;
    if (history) history.scrollTop = history.scrollHeight;
  }, [messages.length]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit({ message: message.trim(), files });
    setMessage("");
    setFiles([]);
  }

  return (
    <Modal open title="Chat del ticket" onClose={onClose} size="xl">
      <div className={styles.layout}>
        <div
          ref={historyRef}
          className={styles.history}
          aria-label="Conversación del ticket"
          aria-live="polite"
        >
          {messages.length > 0 ? (
            messages.map((item) => {
              const isOwn = item.author === currentUserName;

              return (
                <article
                  key={item.id}
                  className={`${styles.message} ${isOwn ? styles.own : ""}`}
                >
                  <div className={styles.meta}>
                    <strong>{item.author}</strong>
                    <time>{formatDateTime(item.createdAt)}</time>
                  </div>
                  {item.message && <p>{item.message}</p>}
                  {item.attachments.length > 0 && (
                    <div className={styles.attachments}>
                      {item.attachments.map((attachment) =>
                        attachment.type === "video" ? (
                          <video
                            key={attachment.id}
                            controls
                            preload="metadata"
                          >
                            <source src={attachment.url} />
                            <track
                              kind="captions"
                              srcLang="es"
                              label="Español"
                            />
                            Tu navegador no puede reproducir este video.
                          </video>
                        ) : (
                          <img
                            key={attachment.id}
                            src={attachment.url}
                            alt={attachment.name}
                          />
                        ),
                      )}
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className={styles.empty}>
              Todavía no hay mensajes. Inicia la conversación.
            </div>
          )}
        </div>

        <form className={styles.composer} onSubmit={handleSubmit}>
          <FormField label="Mensaje" htmlFor="chat-message">
            <Textarea
              id="chat-message"
              rows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  if (canSubmit) event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Escribe un mensaje..."
            />
          </FormField>

          <FormField label="Fotos o videos" htmlFor="chat-attachments">
            <FileUpload
              inputId="chat-attachments"
              value={files}
              onChange={setFiles}
              accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
              multiple
              maxFiles={6}
              maxSize={25 * 1024 * 1024}
              label="Seleccionar fotos o videos"
              helperText="PNG, JPG, WEBP, MP4 o WEBM · Máximo 25 MB"
            />
          </FormField>

          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
            <Button type="submit" variant="primary" disabled={!canSubmit}>
              <Send size={16} aria-hidden="true" />
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function formatDateTime(value: string): string {
  const date = new Date(value.replace(" ", "T"));

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}
