import {
  LayoutGrid,
  LogOut,
  MoreHorizontal,
  Moon,
  PanelTop,
  ShieldCheck,
  Sun,
  UserCircle,
  UserRoundCheck,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { can, PERMISSIONS, useAuth } from "../../../../auth";
import { useTheme } from "../../../../app/hooks/useTheme";
import { ReleaseCrewDialog } from "../../../../features/crews/components/ReleaseCrewDialog/ReleaseCrewDialog";
import { MOCK_RELEASABLE_CREWS } from "../../../../features/crews/mocks/releasableCrews.mock";
import { canReleaseCrew } from "../../../../features/crews/policies/crewAccess";
import { MOCK_TICKETS } from "../../../../features/tickets/config/mockTickets";
import { usePendingNotifications } from "../../../../features/tickets/context/usePendingNotifications";
import { canViewPendingTickets } from "../../../../features/tickets/policies/pendingTicketsAccess";
import { getUnreadPendingTickets } from "../../../../features/tickets/utils/pendingTickets";
import { NocOnlineDialog } from "../../../../features/users/components/NocOnlineDialog/NocOnlineDialog";
import { MOCK_NOC_ONLINE_USERS } from "../../../../features/users/mocks/nocOnlineUsers.mock";

import { FOOTER_ACTIONS, canViewFooterAction } from "./footerActions";
import { TableMenu } from "./TablaMenu/TablaMenu";

import styles from "./SidebarFooter.module.css";

interface FooterButtonProps {
  label: string;
  icon: ReactNode;
  badge?: number;
  onClick?: () => void;
}

export function SidebarFooter() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { notifications } = usePendingNotifications();

  const [moreOpen, setMoreOpen] = useState(false);
  const [nocOnlineOpen, setNocOnlineOpen] = useState(false);
  const [releaseCrewOpen, setReleaseCrewOpen] = useState(false);
  const [releasableCrews, setReleasableCrews] = useState(MOCK_RELEASABLE_CREWS);

  const moreWrapperRef = useRef<HTMLDivElement>(null);

  const visibleActions = FOOTER_ACTIONS.filter((action) =>
    canViewFooterAction(action, user),
  );
  const canViewNocOnline = can(user, PERMISSIONS.NOC_USERS_VIEW);
  const canRelease = canReleaseCrew(user);
  const canViewPending = canViewPendingTickets(user);
  const unreadPendingCount = getUnreadPendingTickets(
    MOCK_TICKETS,
    notifications,
  ).length;

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        moreWrapperRef.current &&
        !moreWrapperRef.current.contains(event.target as Node)
      ) {
        setMoreOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.actions}>
        {canViewNocOnline && (
          <FooterButton
            label="Ver NOC Online"
            icon={<ShieldCheck size={18} />}
            onClick={() => setNocOnlineOpen(true)}
          />
        )}

        {canRelease && (
          <FooterButton
            label="Liberar cuadrilla"
            icon={<UserRoundCheck size={18} />}
            onClick={() => setReleaseCrewOpen(true)}
          />
        )}

        {canViewPending && (
          <FooterButton
            label="Pendientes"
            icon={<PanelTop size={18} />}
            badge={unreadPendingCount}
            onClick={() => navigate("/pending-tickets")}
          />
        )}

        {visibleActions.map(({ id, label, icon: Icon }) => (
          <FooterButton key={id} label={label} icon={<Icon size={18} />} />
        ))}

        <TableMenu />

        <FooterButton
          label="Herramientas conexión"
          icon={<LayoutGrid size={18} />}
        />

        <div ref={moreWrapperRef} className={styles.moreWrapper}>
          <button
            type="button"
            className={styles.iconButton}
            title="Más acciones"
            aria-label="Más acciones"
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            onClick={() => setMoreOpen((current) => !current)}
          >
            <MoreHorizontal size={18} aria-hidden="true" />
          </button>

          {moreOpen && (
            <div className={styles.moreMenu} role="menu">
              <button
                type="button"
                className={styles.menuItem}
                role="menuitem"
                onClick={() => {
                  toggleTheme();
                  setMoreOpen(false);
                }}
              >
                {theme === "light" ? (
                  <Moon size={16} aria-hidden="true" />
                ) : (
                  <Sun size={16} aria-hidden="true" />
                )}
                {theme === "light" ? "Modo oscuro" : "Modo claro"}
              </button>

              <button
                type="button"
                className={styles.menuItem}
                role="menuitem"
                onClick={() => {
                  navigate("/profile");
                  setMoreOpen(false);
                }}
              >
                <UserCircle size={16} aria-hidden="true" />
                Perfil
              </button>

              <button
                type="button"
                className={`${styles.menuItem} ${styles.logout}`}
                role="menuitem"
                onClick={() => setMoreOpen(false)}
              >
                <LogOut size={16} aria-hidden="true" />

                <span>Salir</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {canViewNocOnline && (
        <NocOnlineDialog
          open={nocOnlineOpen}
          users={MOCK_NOC_ONLINE_USERS}
          onClose={() => setNocOnlineOpen(false)}
        />
      )}

      {canRelease && releaseCrewOpen && (
        <ReleaseCrewDialog
          crews={releasableCrews}
          onClose={() => setReleaseCrewOpen(false)}
          onRelease={(crewId) => {
            setReleasableCrews((current) =>
              current.filter((crew) => crew.id !== crewId),
            );
            setReleaseCrewOpen(false);
          }}
        />
      )}
    </footer>
  );
}

interface FooterButtonProps {
  label: string;
  icon: ReactNode;
  badge?: number;
  onClick?: () => void;
}

function FooterButton({ label, icon, badge = 0, onClick }: FooterButtonProps) {
  const accessibleLabel = badge > 0 ? `${label}: ${badge} sin leer` : label;

  return (
    <button
      type="button"
      className={styles.iconButton}
      title={label}
      aria-label={accessibleLabel}
      onClick={onClick}
    >
      {icon}
      {badge > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}
