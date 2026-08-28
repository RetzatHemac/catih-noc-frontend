import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Children } from "react";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  // Check if children contains icons (JSX elements) and text
  const hasIcons = Children.toArray(children).some((child) => {
    return typeof child === "object" && child !== null && "type" in child;
  });

  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      type={props.type ?? "button"}
      className={classNames}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}

      {hasIcons ? children : <span>{children}</span>}
    </button>
  );
}
