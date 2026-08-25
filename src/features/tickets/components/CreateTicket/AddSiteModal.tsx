import { useState } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Input } from "../../../../components/ui/Input/Input";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Select } from "../../../../components/ui/Select/Select";

import { projectOptions } from "../../mocks/createTicket.mock";

import type {
  CreateSiteFormData,
  SiteOption,
} from "../../types/createTicket.types";

import styles from "./AddSiteModal.module.css";

interface AddSiteModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onSiteCreated: (site: SiteOption) => void;
}

const INITIAL_SITE: CreateSiteFormData = {
  projectId: "",
  code: "",
  name: "",
  address: "",
  municipality: "",
  state: "",
  country: "",
  latitude: "",
  longitude: "",
};

export function AddSiteModal({
  open,
  onClose,
  projectId,
  onSiteCreated,
}: AddSiteModalProps) {
  const [formData, setFormData] = useState<CreateSiteFormData>({
    ...INITIAL_SITE,
    projectId,
  });

  function updateField<K extends keyof CreateSiteFormData>(
    field: K,
    value: CreateSiteFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.projectId || !formData.code || !formData.name) {
      return;
    }

    onSiteCreated({
      value: formData.code,
      label: formData.name,
      code: formData.code,
    });

    handleClose();
  }

  function handleClose() {
    setFormData({
      ...INITIAL_SITE,
      projectId,
    });

    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Agregar sitio" size="lg">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <FormField label="Proyecto" htmlFor="site-project" required>
            <Select
              id="site-project"
              value={formData.projectId}
              options={projectOptions}
              onChange={(event) => updateField("projectId", event.target.value)}
            />
          </FormField>

          <FormField label="Código" htmlFor="site-code" required>
            <Input
              id="site-code"
              value={formData.code}
              onChange={(event) => updateField("code", event.target.value)}
            />
          </FormField>

          <FormField label="Nombre" htmlFor="site-name" required>
            <Input
              id="site-name"
              value={formData.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </FormField>

          <FormField label="Dirección" htmlFor="site-address">
            <Input
              id="site-address"
              value={formData.address}
              onChange={(event) => updateField("address", event.target.value)}
            />
          </FormField>

          <FormField label="Municipio" htmlFor="site-municipality">
            <Input
              id="site-municipality"
              value={formData.municipality}
              onChange={(event) =>
                updateField("municipality", event.target.value)
              }
            />
          </FormField>

          <FormField label="Estado" htmlFor="site-state">
            <Input
              id="site-state"
              value={formData.state}
              onChange={(event) => updateField("state", event.target.value)}
            />
          </FormField>

          <FormField label="País" htmlFor="site-country">
            <Input
              id="site-country"
              value={formData.country}
              onChange={(event) => updateField("country", event.target.value)}
            />
          </FormField>

          <FormField label="Latitud" htmlFor="site-latitude">
            <Input
              id="site-latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(event) => updateField("latitude", event.target.value)}
            />
          </FormField>

          <FormField label="Longitud" htmlFor="site-longitude">
            <Input
              id="site-longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(event) => updateField("longitude", event.target.value)}
            />
          </FormField>
        </div>

        <footer className={styles.actions}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>

          <Button type="submit">Guardar sitio</Button>
        </footer>
      </form>
    </Modal>
  );
}
