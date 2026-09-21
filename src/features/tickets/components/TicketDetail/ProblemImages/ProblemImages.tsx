import { ImageGallery } from "../../../../../components/patterns/ImageGallery/ImageGallery";

import type { TicketImage } from "../../../types/ticketDetail.types";

interface ProblemImagesProps {
  images: TicketImage[];
  onEditDescription?: (imageId: string, description: string) => void;
}

export function ProblemImages({
  images,
  onEditDescription,
}: ProblemImagesProps) {
  return (
    <ImageGallery
      images={images}
      emptyLabel="Sin imagen del problema"
      onEditDescription={onEditDescription}
    />
  );
}
