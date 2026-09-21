import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Pencil,
  Expand,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Button } from "../../ui/Button/Button";

import styles from "./ImageGallery.module.css";
import { ImageViewerDialog } from "./ImageViewerDialog";
import { ImageDescriptionDialog } from "./ImageDescriptionDialog";

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
  onEditDescription?: (imageId: string, description: string) => void;
}

export function ImageGallery({
  images,
  emptyLabel = "Sin imágenes",
  editable = false,
  onDelete,
  onEditDescription,
}: ImageGalleryProps) {
  const [dialog, setDialog] = useState<{
    id: string;
    mode: "view" | "edit";
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(
    () => new Set(),
  );

  if (images.length === 0) {
    return <div className={styles.empty}>{emptyLabel}</div>;
  }

  const safeIndex = Math.min(currentIndex, images.length - 1);

  const currentImage = images[safeIndex]!;
  const hasCurrentImageError = failedImageIds.has(currentImage.id);
  const selectedImage = images.find((image) => image.id === dialog?.id);

  function handleImageError(imageId: string) {
    setFailedImageIds((current) => {
      if (current.has(imageId)) {
        return current;
      }

      const next = new Set(current);
      next.add(imageId);
      return next;
    });
  }

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
          {hasCurrentImageError ? (
            <div className={styles.imageError} role="status">
              <ImageOff size={28} aria-hidden="true" />
              <span>No se pudo cargar esta imagen.</span>
            </div>
          ) : (
            <button
              type="button"
              className={styles.openImage}
              onClick={() => setDialog({ id: currentImage.id, mode: "view" })}
              aria-label="Ampliar imagen"
              aria-haspopup="dialog"
              title="Ampliar imagen"
            >
              <img
                src={currentImage.url}
                alt={currentImage.description || `Imagen ${safeIndex + 1}`}
                className={styles.image}
                onError={() => handleImageError(currentImage.id)}
              />
              <span className={styles.expandHint}>
                <Expand size={16} aria-hidden="true" /> Ampliar
              </span>
            </button>
          )}

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

          <div className={styles.actions}>
            {onEditDescription && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={styles.editButton}
                onClick={() => setDialog({ id: currentImage.id, mode: "edit" })}
                aria-label="Editar descripción de imagen"
                title="Editar descripción"
                aria-haspopup="dialog"
              >
                <Pencil size={17} aria-hidden="true" />
              </Button>
            )}
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
              {failedImageIds.has(image.id) ? (
                <ImageOff
                  className={styles.thumbnailError}
                  size={20}
                  aria-hidden="true"
                />
              ) : (
                <img
                  src={image.url}
                  alt=""
                  aria-hidden="true"
                  onError={() => handleImageError(image.id)}
                />
              )}
            </button>
          ))}
        </div>
      )}
      {selectedImage && dialog?.mode === "view" && (
        <ImageViewerDialog
          key={`${selectedImage.id}:${selectedImage.url}`}
          image={selectedImage}
          onClose={() => setDialog(null)}
        />
      )}
      {selectedImage && dialog?.mode === "edit" && onEditDescription && (
        <ImageDescriptionDialog
          key={selectedImage.id}
          image={selectedImage}
          onClose={() => setDialog(null)}
          onSave={onEditDescription}
        />
      )}
    </div>
  );
}
