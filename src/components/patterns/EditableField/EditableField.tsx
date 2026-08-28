import { Check, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../../ui/Button/Button";
import { Input } from "../../ui/Input/Input";
import { Select } from "../../ui/Select/Select";

import styles from "./EditableField.module.css";

export interface EditableFieldOption {
  value: string;
  label: string;
}

interface EditableFieldBaseProps {
  label: string;
  value?: string | number | null;
  editable?: boolean;
  emptyLabel?: string;
  onSave?: (value: string) => void;
}

interface EditableFieldInputProps
  extends EditableFieldBaseProps {
  control?: "text" | "number" | "datetime-local";
  options?: never;
}

interface EditableFieldSelectProps
  extends EditableFieldBaseProps {
  control: "select";
  options: EditableFieldOption[];
}

type EditableFieldProps =
  | EditableFieldInputProps
  | EditableFieldSelectProps;

export function EditableField({
  label,
  value,
  editable = false,
  emptyLabel = "Sin información",
  onSave,
  ...props
}: EditableFieldProps) {
  const stringValue =
    value === null || value === undefined
      ? ""
      : String(value);

  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] =
    useState(stringValue);

  useEffect(() => {
    if (!isEditing) {
      setDraftValue(stringValue);
    }
  }, [stringValue, isEditing]);

  function handleEdit() {
    setDraftValue(stringValue);
    setIsEditing(true);
  }

  function handleCancel() {
    setDraftValue(stringValue);
    setIsEditing(false);
  }

  function handleSave() {
    onSave?.(draftValue);
    setIsEditing(false);
  }

  function getDisplayValue() {
    if (!stringValue) {
      return emptyLabel;
    }

    if (props.control === "select") {
      const option = props.options.find(
        (item) => item.value === stringValue,
      );

      return option?.label ?? stringValue;
    }

    return stringValue;
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>
        {label}
      </span>

      {isEditing ? (
        <div className={styles.editRow}>
          <div className={styles.control}>
            {props.control === "select" ? (
              <Select
                value={draftValue}
                options={props.options}
                onChange={(event) =>
                  setDraftValue(event.target.value)
                }
              />
            ) : (
              <Input
                type={props.control ?? "text"}
                value={draftValue}
                onChange={(event) =>
                  setDraftValue(event.target.value)
                }
              />
            )}
          </div>

          <div className={styles.editActions}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSave}
              aria-label={`Guardar ${label}`}
              title="Guardar"
            >
              <Check
                size={16}
                aria-hidden="true"
              />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              aria-label={`Cancelar edición de ${label}`}
              title="Cancelar"
            >
              <X
                size={16}
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.valueRow}>
          <span
            className={`${styles.value} ${
              !stringValue ? styles.empty : ""
            }`}
          >
            {getDisplayValue()}
          </span>

          {editable && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={styles.editButton}
              onClick={handleEdit}
              aria-label={`Editar ${label}`}
              title={`Editar ${label}`}
            >
              <Pencil
                size={15}
                aria-hidden="true"
              />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}