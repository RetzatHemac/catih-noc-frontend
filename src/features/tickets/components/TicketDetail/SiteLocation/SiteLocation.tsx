import { ExternalLink, Map, MapPin } from "lucide-react";
import { useState } from "react";

import { Button } from "../../../../../components/ui/Button/Button";

import type { TicketLocation } from "../../../types/ticketDetail.types";

import styles from "./SiteLocation.module.css";

interface SiteLocationProps {
  location: TicketLocation;
}

export function SiteLocation({ location }: SiteLocationProps) {
  const [showMap, setShowMap] = useState(false);

  const coordinates = `${location.latitude},${location.longitude}`;

  const mapEmbedUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}&output=embed`;

  return (
    <div className={styles.container}>
      <div className={styles.information}>
        <div className={styles.coordinates}>
          <MapPin size={18} aria-hidden="true" />

          <span>{coordinates}</span>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setShowMap((current) => !current)}
          >
            <Map size={16} aria-hidden="true" />
            {showMap ? "Ocultar mapa" : "Mostrar mapa"}
          </Button>

          <a
            href={location.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.mapsLink}
          >
            <ExternalLink size={16} aria-hidden="true" />
            Google Maps
          </a>
        </div>
      </div>

      {showMap && (
        <div className={styles.map}>
          <iframe
            title="Ubicación del sitio"
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  );
}
