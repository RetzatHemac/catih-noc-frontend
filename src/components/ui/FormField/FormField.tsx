import type { ReactNode } from "react";

import styles from "./FormField.module.css";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  helperText,
  children,
}: FormFieldProps) {
  const messageId = htmlFor ? `${htmlFor}-message` : undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        <span>{label}</span>

        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {error ? (
        <span id={messageId} className={styles.error} role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span id={messageId} className={styles.helper}>{helperText}</span>
      ) : null}
    </div>
  );
}
