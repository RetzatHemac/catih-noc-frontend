import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "../../ui/Button/Button";

import styles from "./ImageGallery.module.css";

export interface GalleryImage {
  id: string;
  url: string;
  description?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  emptyLabel?: string;
  editable?: boolean;
  onDelete?: (imageId: string) => void;
}

export function ImageGallery({
  images,
  emptyLabel = "Sin imágenes",
  editable = false,
  onDelete,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return <div className={styles.empty}>{emptyLabel}</div>;
  }

  const safeIndex = Math.min(currentIndex, images.length - 1);

  const currentImage = images[safeIndex];

  function handlePrevious() {
    setCurrentIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function handleNext() {
    setCurrentIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  function handleDelete() {
    onDelete?.(currentImage.id);

    setCurrentIndex((current) => Math.max(0, current - 1));
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.mainColumn}>
        <div className={styles.preview}>
          <img
            src={currentImage.url}
            alt={currentImage.description || `Imagen ${safeIndex + 1}`}
            className={styles.image}
          />

          {images.length > 1 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`${styles.navigation} ${styles.previous}`}
                onClick={handlePrevious}
                aria-label="Imagen anterior"
                title="Imagen anterior"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`${styles.navigation} ${styles.next}`}
                onClick={handleNext}
                aria-label="Imagen siguiente"
                title="Imagen siguiente"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </Button>
            </>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.information}>
            <p className={styles.description}>
              {currentImage.description || "Sin descripción"}
            </p>

            {images.length > 1 && (
              <span className={styles.counter}>
                {safeIndex + 1} de {images.length}
              </span>
            )}
          </div>

          {editable && onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={styles.deleteButton}
              onClick={handleDelete}
              aria-label="Eliminar imagen"
              title="Eliminar imagen"
            >
              <Trash2 size={17} aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnails} aria-label="Imágenes disponibles">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={`${styles.thumbnail} ${
                index === safeIndex ? styles.activeThumbnail : ""
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Mostrar imagen ${index + 1}`}
              aria-current={index === safeIndex ? "true" : undefined}
            >
              <img src={image.url} alt="" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
