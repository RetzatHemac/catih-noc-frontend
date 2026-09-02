import { useState } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Input } from "../../../../components/ui/Input/Input";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Select } from "../../../../components/ui/Select/Select";
import { SCHEDULE_USER_OPTIONS } from "../../config/scheduleOptions";

import styles from "./TaskbarActionModal.module.css";

export interface ScheduleVisitFormValue {
  userId: string;
  userName: string;
  scheduledAt: string;
}

interface ScheduleVisitDialogProps {
  initialUserId?: string;
  initialScheduledAt?: string;
  onClose: () => void;
  onSubmit: (value: ScheduleVisitFormValue) => void;
}

export function ScheduleVisitDialog({
  initialUserId = "",
  initialScheduledAt = "",
  onClose,
  onSubmit,
}: ScheduleVisitDialogProps) {
  const [userId, setUserId] = useState(initialUserId);
  const [scheduledAt, setScheduledAt] = useState(initialScheduledAt);
  const user = SCHEDULE_USER_OPTIONS.find((option) => option.value === userId);
  const isValid = Boolean(user && scheduledAt);

  return (
    <Modal
      open
      title="Agendar visita del proveedor"
      onClose={onClose}
      footer={
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="schedule-visit-form" disabled={!isValid}>
            Guardar visita
          </Button>
        </div>
      }
    >
      <form
        id="schedule-visit-form"
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          if (isValid && user) {
            onSubmit({ userId, userName: user.label, scheduledAt });
          }
        }}
      >
        <FormField label="Usuario proveedor" htmlFor="schedule-user" required>
          <Select
            id="schedule-user"
            value={userId}
            options={SCHEDULE_USER_OPTIONS}
            onChange={(event) => setUserId(event.target.value)}
          />
        </FormField>
        <FormField label="Fecha y hora" htmlFor="schedule-date" required>
          <Input
            id="schedule-date"
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
          />
        </FormField>
      </form>
    </Modal>
  );
}
