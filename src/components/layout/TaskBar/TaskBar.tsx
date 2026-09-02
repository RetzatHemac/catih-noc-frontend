import type {
  TaskbarActionConfig,
  TaskbarActionId,
} from "../../../features/tickets/config/taskbarActions";

import { Button } from "../../ui/Button/Button";

import styles from "./TaskBar.module.css";

interface TaskBarProps {
  actions: TaskbarActionConfig[];
  onAction: (actionId: TaskbarActionId) => void;
}

export function TaskBar({ actions, onAction }: TaskBarProps) {
  return (
    <nav className={styles.taskbar} aria-label="Acciones del ticket">
      <div className={styles.actions}>
        {actions.map((action) => {
          const Icon = action.icon;
          const accessibleLabel = action.title ?? action.label;

          return (
            <Button
              key={action.id}
              type="button"
              variant="ghost"
              size="sm"
              className={styles.action}
              onClick={() => onAction(action.id)}
              title={accessibleLabel}
              aria-label={accessibleLabel}
            >
              <Icon size={20} aria-hidden="true" />
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
