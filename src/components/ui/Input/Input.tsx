import type { InputHTMLAttributes } from "react";

import styles from "./Input.module.css";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  const classNames = [styles.input, className ?? ""].filter(Boolean).join(" ");

  return <input {...props} className={classNames} />;
}
