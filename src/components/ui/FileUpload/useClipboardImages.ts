import { useEffect, useRef, useState } from "react";

/** Clipboard access is scoped to this uploader; normal text paste is untouched. */
export function useClipboardImages(
  onFiles: (files: File[]) => void,
  disabled: boolean,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const mounted = useRef(false);
  const [reading, setReading] = useState(false);
  const [clipboardError, setClipboardError] = useState("");
  const latest = useRef({ onFiles, disabled, reading });

  useEffect(() => {
    latest.current = { onFiles, disabled, reading };
  });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const container = containerRef.current;
      if (
        !container ||
        event.defaultPrevented ||
        latest.current.disabled ||
        latest.current.reading
      )
        return;
      const target = event.target instanceof Element ? event.target : null;
      const inside = target !== null && container.contains(target);
      if (!inside) {
        if (!hovered.current) return;
        // Keyboard focus in another uploader or editable field takes priority.
        if (
          target?.closest(
            'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [data-file-upload]',
          )
        )
          return;
      }
      const dialogs = document.querySelectorAll(
        '[role="dialog"][aria-modal="true"]',
      );
      const topDialog = dialogs[dialogs.length - 1];
      if (topDialog && !topDialog.contains(container)) return;
      const data = event.clipboardData;
      if (!data) return;
      const images = Array.from(data.items)
        .filter(
          (item) => item.kind === "file" && item.type.startsWith("image/"),
        )
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null)
        .map(toClipboardImageFile);
      if (!images.length) return;
      event.preventDefault();
      setClipboardError("");
      latest.current.onFiles(images);
    }
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, []);

  async function pasteImage() {
    if (disabled || reading) return;
    setClipboardError("");
    if (!navigator.clipboard?.read) {
      setClipboardError(
        "Este navegador no permite leer con el botón. Enfoca Seleccionar archivos o Seleccionar imagen y pega con Ctrl+V",
      );
      return;
    }
    setReading(true);
    try {
      const items = await navigator.clipboard.read();
      const files: File[] = [];
      for (const item of items) {
        const type = item.types.find((mime) => mime.startsWith("image/"));
        if (!type) continue;
        const blob = await item.getType(type);
        files.push(toClipboardImageFile(blob));
      }
      if (!mounted.current || latest.current.disabled) return;
      if (!files.length)
        setClipboardError(
          "El portapapeles no contiene una imagen. Copia una imagen o una captura de pantalla e inténtalo de nuevo.",
        );
      else latest.current.onFiles(files);
    } catch {
      if (mounted.current)
        setClipboardError(
          "No se pudo leer el portapapeles. Permite el acceso en el navegador o enfoca el cargador y usa Ctrl+V",
        );
    } finally {
      if (mounted.current) setReading(false);
    }
  }

  return {
    containerRef,
    onPointerEnter: () => {
      hovered.current = true;
    },
    onPointerLeave: () => {
      hovered.current = false;
    },
    pasteImage,
    reading,
    clipboardError,
  };
}

/** Async clipboard reads usually provide a Blob without the source filename. */
function toClipboardImageFile(blob: Blob): File {
  if (blob instanceof File && blob.name.trim()) return blob;
  const subtype = blob.type.split("/")[1]?.split("+")[0] || "png";
  const extension = subtype === "jpeg" ? "jpg" : subtype;
  return new File([blob], `image.${extension}`, { type: blob.type });
}
