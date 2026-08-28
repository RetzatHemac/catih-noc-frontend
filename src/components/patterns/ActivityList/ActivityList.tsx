import { Pencil, Trash2, X, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "../../ui/Button/Button";
import { Textarea } from "../../ui/Textarea/Textarea";

import styles from "./ActivityList.module.css";

export interface ActivityItem {
  id: string;
  date: string;
  time: string;
  person?: string;
  message: string;
}

interface ActivityListProps {
  items: ActivityItem[];
  emptyLabel?: string;
  editable?: boolean;
  showPerson?: boolean;
  onEdit?: (id: string, message: string) => void;
  onDelete?: (id: string) => void;
}

export function ActivityList({
  items,
  emptyLabel = "Sin registros",
  editable = false,
  showPerson = false,
  onEdit,
  onDelete,
}: ActivityListProps) {
  if (items.length === 0) {
    return <div className={styles.empty}>{emptyLabel}</div>;
  }

  return (
    <div className={styles.list}>
      {items.map((item) => (
        <ActivityCard
          key={item.id}
          item={item}
          editable={editable}
          showPerson={showPerson}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

interface ActivityCardProps {
  item: ActivityItem;
  editable: boolean;
  showPerson: boolean;
  onEdit?: (id: string, message: string) => void;
  onDelete?: (id: string) => void;
}

function ActivityCard({
  item,
  editable,
  showPerson,
  onEdit,
  onDelete,
}: ActivityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftMessage, setDraftMessage] = useState(item.message);

  function handleCancel() {
    setDraftMessage(item.message);
    setIsEditing(false);
  }

  function handleSave() {
    const value = draftMessage.trim();

    if (!value) {
      return;
    }

    onEdit?.(item.id, value);
    setIsEditing(false);
  }

  return (
    <article className={styles.item}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.dateTime}>
            {item.date} · {item.time}
          </span>

          {showPerson && item.person && (
            <span className={styles.person}>{item.person}</span>
          )}
        </div>

        {editable && !isEditing && (
          <div className={styles.actions}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              aria-label="Editar comentario"
              title="Editar"
            >
              <Pencil size={15} aria-hidden="true" />
            </Button>

            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={styles.deleteButton}
                onClick={() => onDelete(item.id)}
                aria-label="Eliminar comentario"
                title="Eliminar"
              >
                <Trash2 size={16} aria-hidden="true" />
              </Button>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className={styles.editArea}>
          <Textarea
            value={draftMessage}
            rows={3}
            onChange={(event) => setDraftMessage(event.target.value)}
          />

          <div className={styles.editActions}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <X size={16} aria-hidden="true" />
              Cancelar
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={!draftMessage.trim()}
            >
              <Check size={16} aria-hidden="true" />
              Guardar
            </Button>
          </div>
        </div>
      ) : (
        <p className={styles.message}>{item.message}</p>
      )}
    </article>
  );
}
