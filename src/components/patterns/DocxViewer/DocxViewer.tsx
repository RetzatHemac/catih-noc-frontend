import { useEffect, useRef, useState } from "react";
import { StatusMessage } from "../../ui/StatusMessage/StatusMessage";
import styles from "./DocxViewer.module.css";

// The renderer writes into an isolated document. No scripts, forms, external
// resources or navigation to the parent application are allowed inside it.
const FRAME = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; font-src data:; base-uri 'none'; form-action 'none'"><style>body{margin:0;background:#eee;color:#111} .docx-wrapper{padding:12px!important} section.docx{max-width:100%;box-sizing:border-box} img{max-width:100%;height:auto} @media(max-width:600px){section.docx{padding:20px!important} .docx-wrapper{padding:4px!important}}</style></head><body></body></html>`;

export function DocxViewer({ url, name }: { url: string; name: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Document unavailable");
        const bytes = await response.arrayBuffer();
        const { renderAsync } = await import("docx-preview");
        const target = frame.current?.contentDocument;
        if (controller.signal.aborted || !target) return;
        await renderAsync(bytes, target.body, undefined, {
          ignoreWidth: true,
          ignoreHeight: true,
          ignoreFonts: true,
          useBase64URL: true,
          renderAltChunks: false,
          breakPages: true,
        });
        // Read-only rendition: links remain text, and cannot leave the viewer.
        target
          .querySelectorAll("a")
          .forEach((link) => link.removeAttribute("href"));
        if (!controller.signal.aborted) setStatus("ready");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }
    void load();
    return () => controller.abort();
  }, [url, ready]);

  return (
    <>
      {status === "loading" && (
        <StatusMessage>Cargando documento…</StatusMessage>
      )}
      {status === "error" && (
        <StatusMessage tone="error">
          No se pudo mostrar el documento. Puedes descargar el original desde el
          ticket.
        </StatusMessage>
      )}
      <iframe
        ref={frame}
        className={styles.frame}
        title={`Vista de solo lectura: ${name}`}
        sandbox="allow-same-origin"
        srcDoc={FRAME}
        onLoad={() => setReady(true)}
        hidden={status === "error"}
      />
    </>
  );
}
