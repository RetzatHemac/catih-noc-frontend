import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { ReactNode } from "react";

import styles from "./DetailSection.module.css";

interface DetailSectionProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function DetailSection({
  title,
  children,
  actions,
  className = "",
  collapsible = false,
  defaultOpen = true,
}: DetailSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  function handleToggle() {
    if (!collapsible) {
      return;
    }

    setIsOpen((current) => !current);
  }

  return (
    <section className={`${styles.section} ${className}`}>
      <header
        className={`${styles.header} ${
          collapsible ? styles.collapsibleHeader : ""
        }`}
      >
        {collapsible ? (
          <button
            type="button"
            className={styles.toggle}
            onClick={handleToggle}
            aria-expanded={isOpen}
            aria-controls={`detail-section-${title}`}
          >
            <h2 className={styles.title}>{title}</h2>

            <ChevronDown
              size={20}
              className={`${styles.chevron} ${
                isOpen ? styles.chevronOpen : ""
              }`}
              aria-hidden="true"
            />
          </button>
        ) : (
          <h2 className={styles.title}>{title}</h2>
        )}

        {actions && <div className={styles.actions}>{actions}</div>}
      </header>

      {(!collapsible || isOpen) && (
        <div id={`detail-section-${title}`} className={styles.content}>
          {children}
        </div>
      )}
    </section>
  );
}
