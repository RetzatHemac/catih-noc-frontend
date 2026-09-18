import {
  ChevronRight,
  House,
  ShieldCheck,
  UserRoundCheck,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useId, useRef, useState } from "react";
import { can, PERMISSIONS, useAuth } from "../../../../auth";
import { ReleaseCrewDialog } from "../../../../features/crews/components/ReleaseCrewDialog/ReleaseCrewDialog";
import { MOCK_RELEASABLE_CREWS } from "../../../../features/crews/mocks/releasableCrews.mock";
import { canReleaseCrew } from "../../../../features/crews/policies/crewAccess";
import { NocOnlineDialog } from "../../../../features/users/components/NocOnlineDialog/NocOnlineDialog";
import { MOCK_NOC_ONLINE_USERS } from "../../../../features/users/mocks/nocOnlineUsers.mock";
import { TicketListTools } from "../../../../features/tickets/components/TicketListTools/TicketListTools";
import type { TicketListToolsContext } from "../../../../features/tickets/types/ticketListTools.types";
import { getVisibleTicketListTools } from "../../../../features/tickets/policies/ticketListToolsAccess";
import { getVisibleSidebarTables } from "./sidebarMenu.config";
import { TableMenu } from "./TableMenu";
import styles from "./SidebarMenu.module.css";

interface SidebarMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
  listToolsContext: TicketListToolsContext;
}

export function SidebarMenu({
  id,
  open,
  onClose,
  onNavigate,
  listToolsContext,
}: SidebarMenuProps) {
  const { user } = useAuth();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const [dialog, setDialog] = useState<"noc" | "crews" | null>(null);
  const [crews, setCrews] = useState(MOCK_RELEASABLE_CREWS);
  const canViewNoc = can(user, PERMISSIONS.NOC_USERS_VIEW);
  const canRelease = canReleaseCrew(user);
  const hasTables = getVisibleSidebarTables(user).length > 0;
  const hasTools = getVisibleTicketListTools(user).length > 0;

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }

    panel.addEventListener("keydown", handleKeyDown);
    return () => panel.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <section
      ref={panelRef}
      id={id}
      hidden={!open}
      className={styles.panel}
      aria-labelledby={titleId}
    >
      <header className={styles.header}>
        <div>
          <h2 id={titleId}>Menú</h2>
          <p>Operación y consultas</p>
        </div>
        <button
          ref={closeRef}
          type="button"
          className={styles.closeButton}
          aria-label="Cerrar menú"
          title="Cerrar menú"
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </button>
      </header>
      <div className={styles.content}>
        <NavLink to="/welcome" className={styles.item} onClick={onNavigate}>
          <span className={styles.icon}>
            <House size={21} aria-hidden="true" />
          </span>
          <span className={styles.label}>
            Inicio<small>Bienvenida a tu espacio de trabajo</small>
          </span>
          <ChevronRight size={18} aria-hidden="true" />
        </NavLink>
        {(canViewNoc || canRelease) && (
          <section className={styles.group} aria-label="Operación">
            <h3>Operación</h3>
            {canViewNoc && (
              <button
                type="button"
                className={styles.item}
                onClick={() => setDialog("noc")}
              >
                <span className={styles.icon}>
                  <ShieldCheck size={21} aria-hidden="true" />
                </span>
                <span className={styles.label}>
                  NOC Online<small>Consulta usuarios disponibles</small>
                </span>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            )}
            {canRelease && (
              <button
                type="button"
                className={styles.item}
                onClick={() => setDialog("crews")}
              >
                <span className={styles.icon}>
                  <UserRoundCheck size={21} aria-hidden="true" />
                </span>
                <span className={styles.label}>
                  Liberar cuadrilla<small>Gestiona cuadrillas pendientes</small>
                </span>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            )}
          </section>
        )}
        {hasTools && (
          <section className={styles.group} aria-label="Lista de tickets">
            <h3>Lista de tickets</h3>
            <TicketListTools context={listToolsContext} />
          </section>
        )}
        {hasTables && (
          <section className={styles.group} aria-label="Administración">
            <h3>Administración</h3>
            <TableMenu onNavigate={onNavigate} />
          </section>
        )}
        {!canViewNoc && !canRelease && !hasTables && !hasTools && (
          <p className={styles.empty}>
            No hay opciones adicionales disponibles para tu usuario.
          </p>
        )}
      </div>
      {open && canViewNoc && (
        <NocOnlineDialog
          open={dialog === "noc"}
          users={MOCK_NOC_ONLINE_USERS}
          onClose={() => setDialog(null)}
        />
      )}
      {open && canRelease && dialog === "crews" && (
        <ReleaseCrewDialog
          crews={crews}
          onClose={() => setDialog(null)}
          onRelease={(crewId) => {
            setCrews((current) => current.filter((crew) => crew.id !== crewId));
            setDialog(null);
          }}
        />
      )}
    </section>
  );
}
