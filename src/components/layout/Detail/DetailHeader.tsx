import { ArrowLeft, Ticket } from "lucide-react";

import { useMatches } from "react-router-dom";

import { useNavigation } from "../../../app/providers/NavigationProvider";

import type { DetailRouteHandle } from "../../../app/types/route.types";

import styles from "./DetailHeader.module.css";

export function DetailHeader() {
  const matches = useMatches();
  const { goToSidebar } = useNavigation();

  const currentMatch = matches.at(-1);

  const detail = currentMatch?.handle as DetailRouteHandle | undefined;

  const title = detail?.title ?? "CATiH";
  const description = detail?.description;
  const Icon = detail?.icon ?? Ticket;

  const isDetailView = Boolean(detail);

  function handleBack() {
    goToSidebar();
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {isDetailView && (
          <button
            type="button"
            className={styles.backButton}
            onClick={handleBack}
            aria-label="Regresar"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
        )}

        <div className={styles.icon}>
          <Icon size={22} aria-hidden="true" />
        </div>

        <div className={styles.titleGroup}>
          <h1>{title}</h1>

          {description && <p>{description}</p>}
        </div>
      </div>
    </header>
  );
}
