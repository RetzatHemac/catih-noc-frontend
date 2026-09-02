import { useState } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Input } from "../../../../components/ui/Input/Input";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Select } from "../../../../components/ui/Select/Select";
import {
  BRAND_MODEL_OPTIONS,
  DAMAGED_EQUIPMENT_OPTIONS,
  REPLACEMENT_OBSERVATION_OPTIONS,
  REPLACEMENT_SERIAL_OPTIONS,
} from "../../config/inventoryOptions";

import layoutStyles from "./TaskbarActionModal.module.css";
import styles from "./InventoryActionModal.module.css";

const MANUAL_VALUE = "manual";

const damagedSerialOptions = [
  ...DAMAGED_EQUIPMENT_OPTIONS.map((item) => ({
    value: item.serial,
    label: item.serial,
  })),
  { value: MANUAL_VALUE, label: "Ingresar manualmente" },
];

const replacementSerialOptions = [
  ...REPLACEMENT_SERIAL_OPTIONS.map((serial) => ({
    value: serial,
    label: serial,
  })),
  { value: MANUAL_VALUE, label: "Ingresar manualmente" },
];

const brandModelOptions = [
  ...BRAND_MODEL_OPTIONS.map((item) => ({
    value: item.value,
    label: `${item.brand} · ${item.model}`,
  })),
  { value: MANUAL_VALUE, label: "Ingresar marca y modelo manualmente" },
];

const observationOptions = REPLACEMENT_OBSERVATION_OPTIONS.map((value) => ({
  value,
  label: value,
}));

interface InventoryActionModalProps {
  onClose: () => void;
  onSubmit: (value: InventoryFormValue) => void;
}

export interface InventoryFormValue {
  damagedBrand: string;
  damagedModel: string;
  damagedSerial: string;
  replacementBrand: string;
  replacementModel: string;
  replacementSerial: string;
  observations: string;
}

export function InventoryActionModal({
  onClose,
  onSubmit,
}: InventoryActionModalProps) {
  const [damagedSerialChoice, setDamagedSerialChoice] = useState("");
  const [damagedManualSerial, setDamagedManualSerial] = useState("");
  const [damagedModelChoice, setDamagedModelChoice] = useState("");
  const [damagedManualBrand, setDamagedManualBrand] = useState("");
  const [damagedManualModel, setDamagedManualModel] = useState("");
  const [replacementSerialChoice, setReplacementSerialChoice] = useState("");
  const [replacementManualSerial, setReplacementManualSerial] = useState("");
  const [replacementModelChoice, setReplacementModelChoice] = useState("");
  const [replacementManualBrand, setReplacementManualBrand] = useState("");
  const [replacementManualModel, setReplacementManualModel] = useState("");
  const [observation, setObservation] = useState("");

  const damagedEquipment = DAMAGED_EQUIPMENT_OPTIONS.find(
    (item) => item.serial === damagedSerialChoice,
  );
  const damagedBrandModel = BRAND_MODEL_OPTIONS.find(
    (item) => item.value === damagedModelChoice,
  );
  const replacementBrandModel = BRAND_MODEL_OPTIONS.find(
    (item) => item.value === replacementModelChoice,
  );
  const damagedSerial =
    damagedSerialChoice === MANUAL_VALUE
      ? damagedManualSerial.trim()
      : damagedSerialChoice;
  const damagedBrand =
    damagedSerialChoice === MANUAL_VALUE
      ? damagedModelChoice === MANUAL_VALUE
        ? damagedManualBrand.trim()
        : (damagedBrandModel?.brand ?? "")
      : (damagedEquipment?.brand ?? "");
  const damagedModel =
    damagedSerialChoice === MANUAL_VALUE
      ? damagedModelChoice === MANUAL_VALUE
        ? damagedManualModel.trim()
        : (damagedBrandModel?.model ?? "")
      : (damagedEquipment?.model ?? "");
  const replacementSerial =
    replacementSerialChoice === MANUAL_VALUE
      ? replacementManualSerial.trim()
      : replacementSerialChoice;
  const replacementBrand =
    replacementModelChoice === MANUAL_VALUE
      ? replacementManualBrand.trim()
      : (replacementBrandModel?.brand ?? "");
  const replacementModel =
    replacementModelChoice === MANUAL_VALUE
      ? replacementManualModel.trim()
      : (replacementBrandModel?.model ?? "");
  const isValid = Boolean(
    damagedSerial &&
    damagedBrand &&
    damagedModel &&
    replacementSerial &&
    replacementBrand &&
    replacementModel &&
    observation,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid) return;

    onSubmit({
      damagedBrand,
      damagedModel,
      damagedSerial,
      replacementBrand,
      replacementModel,
      replacementSerial,
      observations: observation,
    });
  }

  return (
    <Modal
      open
      title="Registrar inventario"
      onClose={onClose}
      size="lg"
      footer={
        <div className={layoutStyles.footer}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="inventory-form"
            variant="primary"
            disabled={!isValid}
          >
            Registrar inventario
          </Button>
        </div>
      }
    >
      <form id="inventory-form" className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.module}>
          <legend>Equipo dañado inicial</legend>
          <div className={styles.grid}>
            <FormField
              label="Serie dañada"
              htmlFor="damaged-serial-choice"
              required
            >
              <Select
                id="damaged-serial-choice"
                value={damagedSerialChoice}
                options={damagedSerialOptions}
                onChange={(event) => {
                  setDamagedSerialChoice(event.target.value);
                  setDamagedModelChoice("");
                }}
              />
            </FormField>

            {damagedSerialChoice === MANUAL_VALUE && (
              <>
                <FormField
                  label="Número de serie del equipo dañado"
                  htmlFor="damaged-manual-serial"
                  required
                >
                  <Input
                    id="damaged-manual-serial"
                    value={damagedManualSerial}
                    onChange={(event) =>
                      setDamagedManualSerial(event.target.value)
                    }
                  />
                </FormField>
                <FormField
                  label="Marca y modelo del equipo dañado"
                  htmlFor="damaged-model-choice"
                  required
                >
                  <Select
                    id="damaged-model-choice"
                    value={damagedModelChoice}
                    options={brandModelOptions}
                    onChange={(event) =>
                      setDamagedModelChoice(event.target.value)
                    }
                  />
                </FormField>
                {damagedModelChoice === MANUAL_VALUE && (
                  <ManualBrandModelFields
                    prefix="damaged"
                    context="del equipo dañado"
                    brand={damagedManualBrand}
                    model={damagedManualModel}
                    onBrandChange={setDamagedManualBrand}
                    onModelChange={setDamagedManualModel}
                  />
                )}
              </>
            )}

            {damagedEquipment && (
              <div className={styles.summary}>
                <span>Marca</span>
                <strong>{damagedEquipment.brand}</strong>
                <span>Modelo</span>
                <strong>{damagedEquipment.model}</strong>
              </div>
            )}
          </div>
        </fieldset>

        <fieldset className={styles.module}>
          <legend>Equipo de reemplazo</legend>
          <div className={styles.grid}>
            <FormField
              label="Serie de reemplazo"
              htmlFor="replacement-serial-choice"
              required
            >
              <Select
                id="replacement-serial-choice"
                value={replacementSerialChoice}
                options={replacementSerialOptions}
                onChange={(event) =>
                  setReplacementSerialChoice(event.target.value)
                }
              />
            </FormField>
            {replacementSerialChoice === MANUAL_VALUE && (
              <FormField
                label="Número de serie del equipo de reemplazo"
                htmlFor="replacement-manual-serial"
                required
              >
                <Input
                  id="replacement-manual-serial"
                  value={replacementManualSerial}
                  onChange={(event) =>
                    setReplacementManualSerial(event.target.value)
                  }
                />
              </FormField>
            )}

            <FormField
              label="Marca y modelo del equipo de reemplazo"
              htmlFor="replacement-model-choice"
              required
            >
              <Select
                id="replacement-model-choice"
                value={replacementModelChoice}
                options={brandModelOptions}
                onChange={(event) =>
                  setReplacementModelChoice(event.target.value)
                }
              />
            </FormField>
            {replacementModelChoice === MANUAL_VALUE && (
              <ManualBrandModelFields
                prefix="replacement"
                context="del equipo de reemplazo"
                brand={replacementManualBrand}
                model={replacementManualModel}
                onBrandChange={setReplacementManualBrand}
                onModelChange={setReplacementManualModel}
              />
            )}

            <div className={styles.wide}>
              <FormField
                label="Observación"
                htmlFor="replacement-observation"
                required
              >
                <Select
                  id="replacement-observation"
                  value={observation}
                  options={observationOptions}
                  onChange={(event) => setObservation(event.target.value)}
                />
              </FormField>
            </div>
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}

interface ManualBrandModelFieldsProps {
  prefix: string;
  context: string;
  brand: string;
  model: string;
  onBrandChange: (value: string) => void;
  onModelChange: (value: string) => void;
}

function ManualBrandModelFields({
  prefix,
  context,
  brand,
  model,
  onBrandChange,
  onModelChange,
}: ManualBrandModelFieldsProps) {
  return (
    <>
      <FormField
        label={`Marca ${context}`}
        htmlFor={`${prefix}-manual-brand`}
        required
      >
        <Input
          id={`${prefix}-manual-brand`}
          value={brand}
          onChange={(event) => onBrandChange(event.target.value)}
        />
      </FormField>
      <FormField
        label={`Modelo ${context}`}
        htmlFor={`${prefix}-manual-model`}
        required
      >
        <Input
          id={`${prefix}-manual-model`}
          value={model}
          onChange={(event) => onModelChange(event.target.value)}
        />
      </FormField>
    </>
  );
}
