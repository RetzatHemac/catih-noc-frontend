import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useNavigation } from "../../../../app/hooks/useNavigation";
import styles from "./SidebarToggle.module.css";

export function SidebarToggle({ sidebarId }: { sidebarId: string }) {
  const { isDesktop, showSidebar, toggleDesktopSidebar } = useNavigation();
  if (!isDesktop) return null;

  const label = showSidebar ? "Ocultar panel lateral" : "Mostrar panel lateral";
  const Icon = showSidebar ? PanelLeftClose : PanelLeftOpen;

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleDesktopSidebar}
      aria-label={label}
      title={label}
      aria-expanded={showSidebar}
      aria-controls={sidebarId}
    >
      <Icon size={21} aria-hidden="true" />
    </button>
  );
}
