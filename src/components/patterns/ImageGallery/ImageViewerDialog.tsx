import { ImageOff } from "lucide-react";
import { useState } from "react";
import { Modal } from "../../ui/Modal/Modal";
import type { GalleryImage } from "./ImageGallery";
import styles from "./ImageGalleryDialogs.module.css";

export function ImageViewerDialog({
  image,
  onClose,
}: {
  image: GalleryImage;
  onClose: () => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Modal open title="Vista ampliada" size="xl" onClose={onClose}>
      <figure className={styles.figure}>
        {failed ? (
          <div className={styles.error} role="status">
            <ImageOff aria-hidden="true" />
            No se pudo cargar esta imagen.
          </div>
        ) : (
          <img
            className={styles.image}
            src={image.url}
            alt={image.description || "Imagen ampliada"}
            onError={() => setFailed(true)}
          />
        )}
        <figcaption className={styles.caption}>
          {image.description || "Sin descripción"}
        </figcaption>
      </figure>
    </Modal>
  );
}
