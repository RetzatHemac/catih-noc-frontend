import { useState } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FileUpload } from "../../../../components/ui/FileUpload/FileUpload";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Input } from "../../../../components/ui/Input/Input";
import { Modal } from "../../../../components/ui/Modal/Modal";
import type { TicketImageGroups } from "../../types/ticketDetail.types";

import layoutStyles from "./TaskbarActionModal.module.css";
import styles from "./ImageUploadActionModal.module.css";

const groups: { id: keyof TicketImageGroups; label: string }[] = [
  { id: "beforeReplacement", label: "Antes reemplazo" },
  { id: "afterReplacement", label: "Después reemplazo" },
  { id: "beforeCurrent", label: "Antes actual" },
  { id: "afterCurrent", label: "Después actual" },
  { id: "generalFinding", label: "General" },
  { id: "closeFinding", label: "Acercamiento" },
];

export interface ImageUploadFormValue {
  group: keyof TicketImageGroups;
  description: string;
  files: File[];
}

interface ImageUploadActionModalProps {
  imageGroups: TicketImageGroups;
  onClose: () => void;
  onSubmit: (value: ImageUploadFormValue) => void;
}

export function ImageUploadActionModal({
  imageGroups,
  onClose,
  onSubmit,
}: ImageUploadActionModalProps) {
  const [activeGroup, setActiveGroup] =
    useState<keyof TicketImageGroups>("beforeReplacement");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Modal
      open
      title="Subir imágenes"
      onClose={onClose}
      size="lg"
      footer={
        <div className={layoutStyles.footer}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="image-upload-form"
            variant="primary"
            disabled={files.length === 0}
          >
            Agregar imágenes
          </Button>
        </div>
      }
    >
      <div className={styles.tabs} role="tablist" aria-label="Tipo de imagen">
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            id={`image-tab-${group.id}`}
            className={`${styles.tab} ${
              activeGroup === group.id ? styles.active : ""
            }`}
            role="tab"
            tabIndex={activeGroup === group.id ? 0 : -1}
            aria-selected={activeGroup === group.id}
            aria-controls="image-upload-form"
            onClick={() => {
              setActiveGroup(group.id);
              setFiles([]);
              setDescription("");
            }}
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              ) {
                return;
              }

              event.preventDefault();
              const currentIndex = groups.findIndex(
                (item) => item.id === group.id,
              );
              const nextIndex =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? groups.length - 1
                    : (currentIndex +
                        (event.key === "ArrowRight" ? 1 : -1) +
                        groups.length) %
                      groups.length;
              const nextGroup = groups[nextIndex];
              if (!nextGroup) return;
              setActiveGroup(nextGroup.id);
              document.getElementById(`image-tab-${nextGroup.id}`)?.focus();
            }}
          >
            {group.label}
            <span>{imageGroups[group.id].length}</span>
          </button>
        ))}
      </div>

      <form
        id="image-upload-form"
        className={layoutStyles.form}
        role="tabpanel"
        aria-labelledby={`image-tab-${activeGroup}`}
        onSubmit={(event) => {
          event.preventDefault();
          if (files.length > 0) {
            onSubmit({ group: activeGroup, description, files });
          }
        }}
      >
        <div className={styles.currentImages}>
          {imageGroups[activeGroup].length > 0 ? (
            imageGroups[activeGroup].map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt={image.description || "Imagen del ticket"}
              />
            ))
          ) : (
            <span>No hay imágenes en esta sección.</span>
          )}
        </div>

        <FormField
          label="Descripción"
          htmlFor="image-description"
          helperText="Se usará el nombre del archivo si se deja vacío."
        >
          <Input
            id="image-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </FormField>

        <FormField label="Archivos" htmlFor="ticket-images" required>
          <FileUpload
            inputId="ticket-images"
            value={files}
            onChange={setFiles}
            multiple
            maxFiles={6}
          />
        </FormField>
      </form>
    </Modal>
  );
}
