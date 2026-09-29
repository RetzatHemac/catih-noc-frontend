import { useId, useRef, useState } from "react";

import { ClipboardPaste, File, Trash2, Upload } from "lucide-react";
import { StatusMessage } from "../StatusMessage/StatusMessage";
import { useClipboardImages } from "./useClipboardImages";

import styles from "./FileUpload.module.css";

interface FileUploadProps {
  inputId?: string;
  value: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  label?: string;
  helperText?: string;
}

export function FileUpload({
  inputId,
  value,
  onChange,
  accept = 'image/png,image/jpeg,image/webp,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,text/plain,application/zip,application/x-7z-compressed',
  multiple = true,
  maxFiles = 3,
  maxSize = 15 * 1024 * 1024,
  disabled = false,
  label,
  helperText,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const [error, setError] = useState("");

  function addFiles(selectedFiles: File[]) {
    if (disabled) return;
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
        `Puedes adjuntar como máximo ${maxFiles} archivos. Se añadieron únicamente los que caben; elimina uno para cambiarlo.`,
      );
    }
    setError(messages.join(" "));

    const nextFiles = multiple
      ? [...value, ...validFiles].slice(0, maxFiles)
      : validFiles.slice(0, 1);

    if (validFiles.length) onChange(nextFiles);
  }

  const {
    containerRef,
    onPointerEnter,
    onPointerLeave,
    pasteImage,
    reading,
    clipboardError,
  } = useClipboardImages(addFiles, disabled);

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeFile(index: number) {
    setError("");
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
        disabled={disabled}
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
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={20} aria-hidden="true" />

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
          disabled={disabled || reading}
        >
          <ClipboardPaste size={20} aria-hidden="true" />
        </button>
      </div>
      <small className={styles.pasteHint}>
        Ctrl+V sobre el recuadro para pegar una imagen.
      </small>
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
                disabled={disabled}
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
