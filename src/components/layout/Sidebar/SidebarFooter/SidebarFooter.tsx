import {
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  PanelTop,
  Sun,
  UserCircle,
  X,
} from "lucide-react";
import type { Ref } from "react";
import { useNavigate } from "react-router-dom";

import { can, PERMISSIONS, useAuth } from "../../../../auth";
import { useTheme } from "../../../../app/hooks/useTheme";
import { MOCK_TICKETS } from "../../../../features/tickets/config/mockTickets";
import { usePendingNotifications } from "../../../../features/tickets/context/usePendingNotifications";
import { canViewPendingTickets } from "../../../../features/tickets/policies/pendingTicketsAccess";
import { getUnreadPendingTickets } from "../../../../features/tickets/utils/pendingTickets";
import { FooterIconButton } from "./FooterIconButton";

import styles from "./SidebarFooter.module.css";

interface SidebarFooterProps {
  onPendingClick: () => void;
  menuOpen: boolean;
  menuId: string;
  menuButtonRef: Ref<HTMLButtonElement>;
  onToggleMenu: () => void;
  onNavigate: () => void;
}

export function SidebarFooter({
  onPendingClick,
  menuOpen,
  menuId,
  menuButtonRef,
  onToggleMenu,
  onNavigate,
}: SidebarFooterProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { notifications } = usePendingNotifications();
  const unreadPendingCount = getUnreadPendingTickets(
    MOCK_TICKETS,
    notifications,
  ).length;

  return (
    <footer className={styles.footer} aria-label="Accesos rápidos">
      <div className={styles.actions}>
        <FooterIconButton
          ref={menuButtonRef}
          label={menuOpen ? "Ocultar menú" : "Desplegar menú"}
          icon={
            menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )
          }
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={onToggleMenu}
        />
        {canViewPendingTickets(user) && (
          <FooterIconButton
            label="Pendientes"
            icon={<PanelTop size={20} aria-hidden="true" />}
            badge={unreadPendingCount}
            onClick={onPendingClick}
          />
        )}
        <FooterIconButton
          label="Herramientas conexión"
          icon={<LayoutGrid size={20} aria-hidden="true" />}
          disabled
          title="Herramientas conexión: disponible en una fase posterior"
        />
        {can(user, PERMISSIONS.PROFILE_VIEW) && (
          <FooterIconButton
            label="Perfil"
            icon={<UserCircle size={20} aria-hidden="true" />}
            onClick={() => {
              onNavigate();
              navigate("/profile");
            }}
          />
        )}
        <FooterIconButton
          label={theme === "light" ? "Modo oscuro" : "Modo claro"}
          icon={
            theme === "light" ? (
              <Moon size={20} aria-hidden="true" />
            ) : (
              <Sun size={20} aria-hidden="true" />
            )
          }
          onClick={toggleTheme}
        />
        <FooterIconButton
          label="Salir"
          icon={<LogOut size={20} aria-hidden="true" />}
          disabled
          title="Salir: disponible al integrar la sesión"
        />
      </div>
    </footer>
  );
}
