import {
  Building2,
  FolderKanban,
  ListChecks,
  Network,
  Tags,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import styles from "./TablaMenu.module.css";

const tables = [
  {
    id: "sites",
    label: "Tabla sitios",
    icon: Building2,
  },
  {
    id: "tagged",
    label: "Tabla etiquetados",
    icon: Tags,
  },
  {
    id: "projects",
    label: "Tabla proyectos",
    icon: FolderKanban,
  },
  {
    id: "diagnostics",
    label: "Tabla diagnostico",
    icon: ListChecks,
  },
  {
    id: "models",
    label: "Tabla marcas y modelos",
    icon: Network,
  },
];

export function TableMenu() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
    >
      <button
        type="button"
        className={styles.button}
        onClick={() => setOpen((current) => !current)}
        aria-label="Tablas"
        aria-expanded={open}
        aria-haspopup="menu"
        title="Tablas"
      >
        <ListChecks
          size={18}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className={styles.menu}
          role="menu"
        >
          <span className={styles.title}>
            Tablas
          </span>

          {tables.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={styles.item}
              role="menuitem"
              onClick={() => {
                // Por ahora solo cerramos.
                // Después aquí irá la navegación/acción.
                setOpen(false);
              }}
            >
              <Icon
                size={16}
                aria-hidden="true"
              />

              <span>{label}</span>

            </button>
          ))}
        </div>
      )}
    </div>
  );
}