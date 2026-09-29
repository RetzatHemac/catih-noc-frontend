import { useEffect, useId, useRef, useState } from "react";

import {
  ClipboardPaste,
  File,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";
import { StatusMessage } from "../StatusMessage/StatusMessage";
import { useClipboardImages } from "./useClipboardImages";

import styles from "./FileUpload.module.css";

interface FileUploadProps {
  inputId?: string;
  value: File[];
  onChange: (files: File[]) => void;
  onBusyChange?: (busy: boolean) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  maxTotalSize?: number;
  disabled?: boolean;
  label?: string;
  helperText?: string;
}

export function FileUpload({
  inputId,
  value,
  onChange,
  onBusyChange,
  accept = "image/png,image/jpeg,image/webp",
  multiple = false,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024,
  maxTotalSize = Infinity,
  disabled = false,
  label,
  helperText,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState("");
  const readerRef = useRef<FileReader | null>(null);
  const pending = useRef(false);
  const mounted = useRef(false);
  const latest = useRef({ value, onChange, disabled });
  useEffect(() => {
    latest.current = { value, onChange, disabled };
  });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      readerRef.current?.abort();
    };
  }, []);

  function addFiles(selectedFiles: File[]) {
    if (disabled || pending.current) return;
    if (!selectedFiles.length) {
      return;
    }

    const allowedFiles = selectedFiles.filter((file) =>
      matchesAccept(file, accept),
    );
    const validFiles = allowedFiles.filter((file) => file.size <= maxSize);
    const capacity = multiple ? Math.max(0, maxFiles - value.length) : 1;
    const messages: string[] = [];
    if (allowedFiles.length !== selectedFiles.length) {
      messages.push(
        "Algunos archivos tienen un formato no permitido en esta sección.",
      );
    }
    if (validFiles.length !== allowedFiles.length) {
      messages.push(
        `Algunos archivos superan el límite de ${formatFileSize(maxSize)}.`,
      );
    }
    if (validFiles.length > capacity) {
      messages.push(
        `Puedes adjuntar como máximo ${maxFiles} archivos. Elimina uno para cambiarlo.`,
      );
    }
    let total = multiple ? value.reduce((sum, file) => sum + file.size, 0) : 0;
    const accepted: File[] = [];
    let exceedsTotal = false;
    for (const file of validFiles) {
      if (accepted.length >= capacity) break;
      if (total + file.size > maxTotalSize) {
        exceedsTotal = true;
        continue;
      }
      accepted.push(file);
      total += file.size;
    }
    if (exceedsTotal)
      messages.push(
        `La documentación no puede superar ${formatFileSize(maxTotalSize)} en total. No se añadieron los archivos que exceden ese límite.`,
      );
    setError(messages.join(" "));
    setSuccess("");
    if (!accepted.length) return;
    pending.current = true;
    setProcessing(true);
    void prepareFiles(accepted);
  }

  async function prepareFiles(files: File[]) {
    const originalValue = value;
    try {
      // Sequential reads avoid retaining several large file buffers at once.
      for (const file of files) {
        await new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          readerRef.current = reader;
          reader.onload = () => resolve();
          reader.onerror = () => reject(new Error("read"));
          reader.onabort = () => reject(new Error("abort"));
          reader.readAsArrayBuffer(file);
        });
        if (
          !mounted.current ||
          latest.current.disabled ||
          latest.current.value !== originalValue
        )
          return;
      }
      latest.current.onChange(multiple ? [...originalValue, ...files] : files);
      setSuccess(
        files.length === 1
          ? `${files[0]!.name}: cargado correctamente.`
          : `${files.length} archivos cargador correctamente.`,
      );
    } catch {
      if (mounted.current)
        setError("No se pudieron leer los archivos. Vuelve a seleccionarlos.");
    } finally {
      pending.current = false;
      readerRef.current = null;
      if (mounted.current) setProcessing(false);
    }
  }

  const {
    containerRef,
    onPointerEnter,
    onPointerLeave,
    pasteImage,
    reading,
    clipboardError,
  } = useClipboardImages(addFiles, disabled || processing);
  const busy = processing || reading;
  useEffect(() => {
    onBusyChange?.(busy);
    return () => onBusyChange?.(false);
  }, [busy, onBusyChange]);

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeFile(index: number) {
    setError("");
    setSuccess("");
    onChange(value.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        id={inputId ?? generatedId}
        aria-label={
          label ?? (multiple ? "Seleccionar archivos" : "Seleccionar imagen")
        }
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled || busy}
        onChange={handleFiles}
        className={styles.hiddenInput}
      />

      <div
        ref={containerRef}
        data-file-upload
        className={styles.uploadArea}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <button
          type="button"
          className={styles.dropzone}
          disabled={disabled || busy}
          aria-busy={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? (
            <LoaderCircle
              className={styles.spinner}
              size={20}
              aria-hidden="true"
            />
          ) : (
            <Upload size={20} aria-hidden="true" />
          )}

          <span>
            {label ??
              (multiple ? "Seleccionar archivos" : "Seleccionar imagen")}
          </span>

          <small>{helperText ?? "PNG, JPG o WEBP · Máximo 5 MB"}</small>
        </button>

        <button
          type="button"
          className={styles.pasteButton}
          title={reading ? "Leyendo portapapeles…" : "Pegar del portapapeles"}
          aria-label="Pegar del portapapeles"
          aria-busy={reading}
          onClick={pasteImage}
          disabled={disabled || busy}
        >
          <ClipboardPaste size={20} aria-hidden="true" />
        </button>
      </div>
      <small className={styles.pasteHint}>
        Ctrl+V sobre el recuadro para pegar una imagen.
      </small>
      {busy && (
        <StatusMessage>
          {reading ? "Leyendo portapapeles…" : "Preparando archivos…"}
        </StatusMessage>
      )}
      {!busy && !clipboardError && value.length > 0 && success && (
        <StatusMessage tone="success">{success}</StatusMessage>
      )}
      {Number.isFinite(maxTotalSize) && (
        <small className={styles.pasteHint}>
          {formatFileSize(value.reduce((sum, file) => sum + file.size, 0))} de{" "}
          {formatFileSize(maxTotalSize)} utilizados
        </small>
      )}
      {clipboardError && (
        <StatusMessage tone="error">{clipboardError}</StatusMessage>
      )}

      {error && <StatusMessage tone="error">{error}</StatusMessage>}

      {value.length > 0 && (
        <div className={styles.fileList}>
          {value.map((file, index) => (
            <div key={`${file.name}-${index}`} className={styles.fileItem}>
              <File size={18} aria-hidden="true" />

              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>

                <span className={styles.fileSize}>
                  {formatFileSize(file.size)}
                </span>
              </div>

              <button
                type="button"
                disabled={disabled || busy}
                className={styles.removeButton}
                onClick={() => removeFile(index)}
                aria-label={`Eliminar ${file.name}`}
                title="Eliminar archivo"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function matchesAccept(file: File, accept: string) {
  if (!accept.trim()) return true;
  return accept.split(",").some((entry) => {
    const rule = entry.trim().toLowerCase();
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    if (rule.endsWith("/*"))
      return file.type.toLowerCase().startsWith(rule.slice(0, -1));
    return file.type.toLowerCase() === rule;
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
