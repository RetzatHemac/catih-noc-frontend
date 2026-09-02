import { ChevronDown, FileText, Map } from "lucide-react";
import { useState } from "react";

import styles from "./SidebarTools.module.css";

const tools = [
  { label: "Ver mapa", icon: Map },
  { label: "Reporte supervisor", icon: FileText },
  { label: "Reporte filtrado", icon: FileText },
  { label: "Reporte asignado", icon: FileText },
];

export function SidebarTools() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={styles.tools}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        aria-controls="sidebar-tools-content"
      >
        <span>Herramientas</span>
        <ChevronDown
          size={18}
          className={expanded ? styles.expanded : ""}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div id="sidebar-tools-content" className={styles.content}>
          {tools.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className={styles.toolButton}
              disabled
              title="Disponible en una fase posterior"
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
