import { useState } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Select } from "../../../../components/ui/Select/Select";
import { Textarea } from "../../../../components/ui/Textarea/Textarea";
import {
  PAUSE_DEPENDENCY_OPTIONS,
  PAUSE_REASON_OPTIONS,
  type PauseDependency,
} from "../../config/pauseOptions";

import styles from "./TaskbarActionModal.module.css";

export interface PauseTicketFormValue {
  dependency: PauseDependency;
  reasonType: string;
  detail: string;
}

interface PauseTicketDialogProps {
  onClose: () => void;
  onSubmit: (value: PauseTicketFormValue) => void;
}

export function PauseTicketDialog({
  onClose,
  onSubmit,
}: PauseTicketDialogProps) {
  const [dependency, setDependency] = useState<PauseDependency | "">("");
  const [reasonType, setReasonType] = useState("");
  const [detail, setDetail] = useState("");
  const isValid = Boolean(dependency && reasonType && detail.trim());
  const reasonOptions = dependency
    ? PAUSE_REASON_OPTIONS[dependency].map((value) => ({ value, label: value }))
    : [];

  return (
    <Modal
      open
      title="Pausar ticket"
      onClose={onClose}
      footer={
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="pause-ticket-form" disabled={!isValid}>
            Pausar ticket
          </Button>
        </div>
      }
    >
      <form
        id="pause-ticket-form"
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          if (isValid && dependency) {
            onSubmit({ dependency, reasonType, detail: detail.trim() });
          }
        }}
      >
        <FormField label="Dependencia" htmlFor="pause-dependency" required>
          <Select
            id="pause-dependency"
            value={dependency}
            options={PAUSE_DEPENDENCY_OPTIONS}
            onChange={(event) => {
              setDependency(event.target.value as PauseDependency | "");
              setReasonType("");
            }}
          />
        </FormField>
        <FormField label="Motivo" htmlFor="pause-reason" required>
          <Select
            id="pause-reason"
            value={reasonType}
            options={reasonOptions}
            disabled={!dependency}
            onChange={(event) => setReasonType(event.target.value)}
          />
        </FormField>
        <FormField label="Detalle del motivo" htmlFor="pause-detail" required>
          <Textarea
            id="pause-detail"
            rows={4}
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
          />
        </FormField>
      </form>
    </Modal>
  );
}
