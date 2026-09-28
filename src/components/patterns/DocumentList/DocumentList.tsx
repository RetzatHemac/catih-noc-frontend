import { useEffect, useState } from "react";
import { Download, Eye, FileText, ExternalLink } from "lucide-react";
import { Button } from "../../ui/Button/Button";
import { Modal } from "../../ui/Modal/Modal";
import { StatusMessage } from "../../ui/StatusMessage/StatusMessage";
import type { DocumentFile } from "./document.types";
import { documentTabUrl } from "./documentFormat";
import styles from "./DocumentList.module.css";

function previewType(document: DocumentFile) {
  if (/^image\/(png|jpeg|webp|gif|avif|bmp)$/.test(document.mimeType))
    return "image";
  if (
    ["text/plain", "text/csv", "application/json"].includes(
      document.mimeType,
    ) &&
    document.size !== undefined &&
    document.size <= 1024 * 1024
  )
    return "text";
  return null;
}

export function DocumentList({
  documents,
  getWordViewUrl,
}: {
  documents: DocumentFile[];
  getWordViewUrl?: (document: DocumentFile) => string;
}) {
  const [selected, setSelected] = useState<DocumentFile | null>(null);

  if (!documents.length) return <p>Sin documentación adjunta.</p>;

  return (
    <>
      <ul className={styles.list}>
        {documents.map((document) => (
          <li className={styles.item} key={document.id}>
            <div className={styles.info}>
              <FileText size={20} aria-hidden="true" />
              <div>
                <strong className={styles.name}>{document.name}</strong>
                <span className={styles.meta}>
                  {document.size === undefined
                    ? "Archivo adjunto"
                    : `${(document.size / 1024).toFixed(1)} KB`}
                  {!previewType(document) &&
                    !documentTabUrl(document, getWordViewUrl?.(document)) &&
                    " · Disponible para descargar"}
                </span>
              </div>
            </div>
            <div className={styles.actions}>
              {documentTabUrl(document, getWordViewUrl?.(document)) && (
                <a
                  className={styles.download}
                  href={documentTabUrl(document, getWordViewUrl?.(document))}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir ${document.name} en una pestaña nueva`}
                >
                  <ExternalLink size={16} aria-hidden="true" /> Abrir en otra
                  pestaña
                </a>
              )}
              {previewType(document) && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelected(document)}
                  aria-label={`Ver ${document.name}`}
                >
                  <Eye size={16} aria-hidden="true" /> Ver
                </Button>
              )}
              <a
                className={styles.download}
                href={document.url}
                download={document.name}
                aria-label={`Descargar ${document.name}`}
              >
                <Download size={16} aria-hidden="true" /> Descargar
              </a>
            </div>
          </li>
        ))}
      </ul>
      {selected && (
        <Modal
          open
          title={selected.name}
          size="lg"
          onClose={() => setSelected(null)}
          footer={
            <a
              className={styles.download}
              href={selected.url}
              download={selected.name}
            >
              Descargar archivo
            </a>
          }
        >
          <DocumentPreview key={selected.id} document={selected} />
        </Modal>
      )}
    </>
  );
}

function DocumentPreview({ document }: { document: DocumentFile }) {
  const [failed, setFailed] = useState(false);
  return previewType(document) === "image" ? (
    failed ? (
      <StatusMessage tone="error">
        No se pudo cargar la imagen. Puedes descargar el archivo.
      </StatusMessage>
    ) : (
      <img
        className={styles.image}
        src={document.url}
        alt={document.name}
        onError={() => setFailed(true)}
      />
    )
  ) : (
    <TextPreview document={document} />
  );
}

function TextPreview({ document }: { document: DocumentFile }) {
  const [content, setContent] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch(document.url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Document unavailable");
        return response.text();
      })
      .then((text) => {
        if (!controller.signal.aborted) setContent(text);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [document.url]);

  if (failed)
    return (
      <StatusMessage tone="error">
        No se pudo cargar la vista previa. Puedes descargar el archivo.
      </StatusMessage>
    );
  if (content === null)
    return <StatusMessage>Cargando vista previa…</StatusMessage>;
  return <pre className={styles.text}>{content || "Archivo vacío."}</pre>;
}
