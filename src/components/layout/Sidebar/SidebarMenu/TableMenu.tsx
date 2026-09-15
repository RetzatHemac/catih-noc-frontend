import { ChevronDown, TableProperties } from "lucide-react";
import { useId, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../../auth";
import { getVisibleSidebarTables } from "./sidebarMenu.config";
import styles from "./TableMenu.module.css";

interface TableMenuProps {
  onNavigate: () => void;
}

export function TableMenu({ onNavigate }: TableMenuProps) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const tables = getVisibleSidebarTables(user);

  if (!tables.length) return null;

  return (
    <div className={styles.group}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        aria-controls={contentId}
      >
        <span className={styles.icon}>
          <TableProperties size={21} aria-hidden="true" />
        </span>
        <span className={styles.label}>
          Tablas<small>Consulta y administración</small>
        </span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={expanded ? styles.expanded : ""}
        />
      </button>
      <nav
        id={contentId}
        aria-label="Tablas"
        hidden={!expanded}
        className={styles.links}
      >
        {tables.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
