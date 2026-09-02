import {
  LayoutGrid,
  LogOut,
  MoreHorizontal,
  Moon,
  ShieldCheck,
  Sun,
  UserCircle,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { useAuth } from "../../../../auth";
import { useTheme } from "../../../../app/hooks/useTheme";

import { FOOTER_ACTIONS, canViewFooterAction } from "./footerActions";
import { TableMenu } from "./TablaMenu/TablaMenu";

import styles from "./SidebarFooter.module.css";

interface FooterButtonProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

export function SidebarFooter() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [moreOpen, setMoreOpen] = useState(false);

  const moreWrapperRef = useRef<HTMLDivElement>(null);

  const visibleActions = FOOTER_ACTIONS.filter((action) =>
    canViewFooterAction(action, user),
  );

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
        <FooterButton label="Ver NOC Online" icon={<ShieldCheck size={18} />} />

        {visibleActions.map(({ id, label, icon: Icon }) => (
          <FooterButton key={id} label={label} icon={<Icon size={18} />} />
        ))}

        <TableMenu />

        <FooterButton
          label="Herramientas conexión"
          icon={<LayoutGrid size={18} />}
        />

        <FooterButton
          label={theme === "light" ? "Modo oscuro" : "Modo claro"}
          icon={theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          onClick={toggleTheme}
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
                onClick={() => setMoreOpen(false)}
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
    </footer>
  );
}

interface FooterButtonProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

function FooterButton({ label, icon, onClick }: FooterButtonProps) {
  return (
    <button
      type="button"
      className={styles.iconButton}
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
