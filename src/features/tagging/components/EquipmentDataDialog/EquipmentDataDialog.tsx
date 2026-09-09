import { type FormEvent } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Input } from "../../../../components/ui/Input/Input";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Textarea } from "../../../../components/ui/Textarea/Textarea";
import type { TaggedEquipment } from "../../types/taggedEquipment.types";

import styles from "./EquipmentDataDialog.module.css";

interface EquipmentDataDialogProps {
  equipment?: TaggedEquipment;
  onClose: () => void;
  onSave: (equipment: TaggedEquipment) => void;
}

export function EquipmentDataDialog({
  equipment,
  onClose,
  onSave,
}: EquipmentDataDialogProps) {
  if (!equipment) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    onSave({
      ...equipment!,
      dimensions: String(data.get("dimensions") ?? "").trim(),
      color: String(data.get("color") ?? "").trim(),
      description: String(data.get("description") ?? "").trim(),
    });
  }

  return (
    <Modal
      open
      title="Datos equipo"
      size="md"
      onClose={onClose}
      initialFocusId="equipment-dimensions"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="equipment-data-form">
            Guardar
          </Button>
        </>
      }
    >
      <form
        id="equipment-data-form"
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <p className={styles.subtitle}>
          Información de equipo: <strong>{equipment.model}</strong>
        </p>

        <div className={styles.fields}>
          <FormField
            label="Dimensiones"
            htmlFor="equipment-dimensions"
            required
          >
            <Input
              id="equipment-dimensions"
              name="dimensions"
              defaultValue={equipment.dimensions}
              required
            />
          </FormField>

          <FormField label="Color" htmlFor="equipment-color" required>
            <Input
              id="equipment-color"
              name="color"
              defaultValue={equipment.color}
              required
            />
          </FormField>
        </div>

        <FormField
          label="Descripción del equipo"
          htmlFor="equipment-description"
        >
          <Textarea
            id="equipment-description"
            name="description"
            rows={5}
            defaultValue={equipment.description}
          />
        </FormField>
      </form>
    </Modal>
  );
}
