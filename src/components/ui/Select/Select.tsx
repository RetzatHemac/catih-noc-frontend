import type { SelectHTMLAttributes } from "react";

import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  options,
  placeholder = "Seleccionar...",
  className,
  ...props
}: SelectProps) {
  const classNames = [styles.select, className ?? ""].filter(Boolean).join(" ");

  return (
    <select {...props} className={classNames}>
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
