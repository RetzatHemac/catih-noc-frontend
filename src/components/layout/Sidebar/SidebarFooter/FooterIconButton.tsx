import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./SidebarFooter.module.css";

interface FooterIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
  badge?: number;
  ref?: Ref<HTMLButtonElement>;
}

export function FooterIconButton({
  label,
  icon,
  badge = 0,
  className = "",
  ref,
  ...props
}: FooterIconButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.iconButton} ${className}`}
      title={label}
      aria-label={badge > 0 ? `${label}: ${badge} sin leer` : label}
      {...props}
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
