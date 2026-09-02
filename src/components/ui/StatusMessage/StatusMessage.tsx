import type { HTMLAttributes, ReactNode } from "react";

import styles from "./StatusMessage.module.css";

type StatusMessageTone = "success" | "error" | "info";

interface StatusMessageProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tone?: StatusMessageTone;
}

export function StatusMessage({
  children,
  tone = "info",
  className,
  ...rest
}: StatusMessageProps) {
  return (
    <div
      {...rest}
      className={`${styles.message} ${styles[tone]} ${className ?? ""}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
