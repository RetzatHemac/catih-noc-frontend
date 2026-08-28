import { ImageGallery } from "../../../../../components/patterns/ImageGallery/ImageGallery";

import type { TicketImage } from "../../../types/ticketDetail.types";

interface ProblemImagesProps {
  images: TicketImage[];
}

export function ProblemImages({ images }: ProblemImagesProps) {
  return <ImageGallery images={images} emptyLabel="Sin imagen del problema" />;
}
