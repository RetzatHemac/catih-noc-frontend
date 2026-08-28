import styles from "./DescriptionSection.module.css";

interface DescriptionSectionProps {
  description?: string;
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  return (
    <p className={description ? styles.description : styles.empty}>
      {description || "Sin descripción"}
    </p>
  );
}
