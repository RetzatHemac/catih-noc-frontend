import { useState } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Select } from "../../../../components/ui/Select/Select";
import { Textarea } from "../../../../components/ui/Textarea/Textarea";

import styles from "./TaskbarActionModal.module.css";

export type ActivityScope = "remote" | "onsite";

export interface ActivityFormValue {
  scope: ActivityScope;
  message: string;
}

const scopeOptions = [
  { value: "remote", label: "Actividad remota" },
  { value: "onsite", label: "Actividad en sitio" },
];

interface ActivityActionModalProps {
  onClose: () => void;
  onSubmit: (value: ActivityFormValue) => void;
}

export function ActivityActionModal({
  onClose,
  onSubmit,
}: ActivityActionModalProps) {
  const [scope, setScope] = useState<ActivityScope>("remote");
  const [message, setMessage] = useState("");
  const trimmedMessage = message.trim();

  return (
    <Modal
      open
      title="Reportar actividad"
      onClose={onClose}
      size="sm"
      initialFocusId="activity-message"
      footer={
        <div className={styles.footer}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="activity-form"
            variant="primary"
            disabled={!trimmedMessage}
          >
            Registrar actividad
          </Button>
        </div>
      }
    >
      <form
        id="activity-form"
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          if (trimmedMessage) onSubmit({ scope, message: trimmedMessage });
        }}
      >
        <FormField label="Tipo de actividad" htmlFor="activity-scope" required>
          <Select
            id="activity-scope"
            value={scope}
            options={scopeOptions}
            onChange={(event) => setScope(event.target.value as ActivityScope)}
          />
        </FormField>

        <FormField
          label="Actividad realizada"
          htmlFor="activity-message"
          required
        >
          <Textarea
            id="activity-message"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </FormField>
      </form>
    </Modal>
  );
}
