import { ArrowLeft, Ticket } from "lucide-react";

import { useMatches } from "react-router-dom";

import { useNavigation } from "../../../app/hooks/useNavigation";

import type { DetailRouteHandle } from "../../../app/types/route.types";

import styles from "./DetailHeader.module.css";
import { SidebarToggle } from "../Sidebar/SidebarToggle/SidebarToggle";

export function DetailHeader({ sidebarId }: { sidebarId: string }) {
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
        <SidebarToggle sidebarId={sidebarId} />
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
          <h1 title={title}>{title}</h1>

          {description && <p title={description}>{description}</p>}
        </div>
      </div>
    </header>
  );
}
