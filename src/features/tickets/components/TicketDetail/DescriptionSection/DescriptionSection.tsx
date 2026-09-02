import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";

import { Button } from "../../../../../components/ui/Button/Button";
import { Textarea } from "../../../../../components/ui/Textarea/Textarea";

import styles from "./DescriptionSection.module.css";

interface DescriptionSectionProps {
  description?: string;
  editable?: boolean;
  onSave?: (description: string) => void;
}

export function DescriptionSection({
  description,
  editable = false,
  onSave,
}: DescriptionSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(description ?? "");

  if (isEditing) {
    return (
      <div className={styles.editor}>
        <label htmlFor="ticket-description">Descripción del ticket</label>
        <Textarea
          id="ticket-description"
          rows={5}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft(description ?? "");
              setIsEditing(false);
            }}
          >
            <X size={16} aria-hidden="true" /> Cancelar
          </Button>
          <Button
            size="sm"
            disabled={!draft.trim()}
            onClick={() => {
              onSave?.(draft.trim());
              setIsEditing(false);
            }}
          >
            <Check size={16} aria-hidden="true" /> Guardar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.readView}>
      <p className={description ? styles.description : styles.empty}>
        {description || "Sin descripción"}
      </p>
      {editable && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setDraft(description ?? "");
            setIsEditing(true);
          }}
        >
          <Pencil size={15} aria-hidden="true" /> Editar descripción
        </Button>
      )}
    </div>
  );
}
