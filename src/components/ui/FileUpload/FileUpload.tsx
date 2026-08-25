import { useRef } from "react";

import { FileImage, Trash2, Upload } from "lucide-react";

import styles from "./FileUpload.module.css";

interface FileUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
}

export function FileUpload({
  value,
  onChange,
  accept = "image/png,image/jpeg,image/webp",
  multiple = false,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (!selectedFiles.length) {
      return;
    }

    const validFiles = selectedFiles.filter((file) => file.size <= maxSize);

    const nextFiles = multiple
      ? [...value, ...validFiles].slice(0, maxFiles)
      : validFiles.slice(0, 1);

    onChange(nextFiles);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeFile(index: number) {
    onChange(value.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFiles}
        className={styles.hiddenInput}
      />

      <button
        type="button"
        className={styles.dropzone}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={20} aria-hidden="true" />

        <span>{multiple ? "Seleccionar archivos" : "Seleccionar imagen"}</span>

        <small>PNG, JPG o WEBP · Máximo 5 MB</small>
      </button>

      {value.length > 0 && (
        <div className={styles.fileList}>
          {value.map((file, index) => (
            <div key={`${file.name}-${index}`} className={styles.fileItem}>
              <FileImage size={18} aria-hidden="true" />

              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>

                <span className={styles.fileSize}>
                  {formatFileSize(file.size)}
                </span>
              </div>

              <button
                type="button"
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

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
