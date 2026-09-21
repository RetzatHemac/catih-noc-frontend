import { useId, useState } from "react";
import { Modal } from "../../ui/Modal/Modal";
import { Button } from "../../ui/Button/Button";
import { Textarea } from "../../ui/Textarea/Textarea";
import type { GalleryImage } from "./ImageGallery";
import styles from "./ImageGalleryDialogs.module.css";

export function ImageDescriptionDialog({
  image,
  onClose,
  onSave,
}: {
  image: GalleryImage;
  onClose: () => void;
  onSave: (imageId: string, description: string) => void;
}) {
  const fieldId = useId();
  const formId = useId();
  const [description, setDescription] = useState(image.description ?? "");
  return (
    <Modal
      open
      title="Editar descripción de imagen"
      onClose={onClose}
      initialFocusId={fieldId}
      footer={
        <>
          <Button
            className={styles.action}
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button className={styles.action} type="submit" form={formId}>
            Guardar descripción
          </Button>
        </>
      }
    >
      <form
        id={formId}
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          onSave(image.id, description.trim());
          onClose();
        }}
      >
        <label htmlFor={fieldId}>Descripción</label>
        <Textarea
          id={fieldId}
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
    </Modal>
  );
}
