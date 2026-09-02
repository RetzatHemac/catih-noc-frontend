import { useState } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Input } from "../../../../components/ui/Input/Input";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Textarea } from "../../../../components/ui/Textarea/Textarea";

import styles from "./TaskbarActionModal.module.css";

export interface InterventionFormValue {
  brand: string;
  model: string;
  serial: string;
  observations: string;
}

interface InterventionActionModalProps {
  onClose: () => void;
  onSubmit: (value: InterventionFormValue) => void;
}

export function InterventionActionModal({
  onClose,
  onSubmit,
}: InterventionActionModalProps) {
  const [value, setValue] = useState<InterventionFormValue>({
    brand: "",
    model: "",
    serial: "",
    observations: "",
  });
  const isValid = Object.values(value).every((field) => field.trim());

  function updateField(field: keyof InterventionFormValue, fieldValue: string) {
    setValue((current) => ({ ...current, [field]: fieldValue }));
  }

  return (
    <Modal
      open
      title="Reportar intervención"
      onClose={onClose}
      footer={
        <div className={styles.footer}>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="intervention-form" disabled={!isValid}>
            Registrar intervención
          </Button>
        </div>
      }
    >
      <form
        id="intervention-form"
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          if (isValid) onSubmit(value);
        }}
      >
        <div className={styles.grid}>
          <FormField label="Marca" htmlFor="intervention-brand" required>
            <Input
              id="intervention-brand"
              value={value.brand}
              onChange={(event) => updateField("brand", event.target.value)}
            />
          </FormField>
          <FormField label="Modelo" htmlFor="intervention-model" required>
            <Input
              id="intervention-model"
              value={value.model}
              onChange={(event) => updateField("model", event.target.value)}
            />
          </FormField>
          <div className={styles.wide}>
            <FormField
              label="Número de serie"
              htmlFor="intervention-serial"
              required
            >
              <Input
                id="intervention-serial"
                value={value.serial}
                onChange={(event) => updateField("serial", event.target.value)}
              />
            </FormField>
          </div>
          <div className={styles.wide}>
            <FormField
              label="Observaciones"
              htmlFor="intervention-observations"
              required
            >
              <Textarea
                id="intervention-observations"
                rows={4}
                value={value.observations}
                onChange={(event) =>
                  updateField("observations", event.target.value)
                }
              />
            </FormField>
          </div>
        </div>
      </form>
    </Modal>
  );
}
