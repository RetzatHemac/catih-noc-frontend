import type { FormEvent } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Input } from "../../../../components/ui/Input/Input";
import { Select } from "../../../../components/ui/Select/Select";
import { MOCK_PROJECTS } from "../../../projects/mocks/projects.mock";
import type { SiteRecord } from "../../types/site.types";

import styles from "./SiteForm.module.css";

interface SiteFormProps {
  site: SiteRecord;
  onSave: (site: SiteRecord) => void;
  onCancel: () => void;
}

export function SiteForm({ site, onSave, onCancel }: SiteFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const projectId = value(data, "projectId");
    const project = MOCK_PROJECTS.find((item) => item.id === projectId);

    onSave({
      ...site,
      projectId,
      projectName: project?.name ?? site.projectName,
      name: value(data, "name"),
      code: value(data, "code"),
      latitude: Number(data.get("latitude") || 0),
      longitude: Number(data.get("longitude") || 0),
      address: value(data, "address"),
      municipality: value(data, "municipality"),
      state: value(data, "state"),
      country: value(data, "country"),
    });
  }

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <header>
          <h2>Editar sitio {site.code}</h2>
          <p>Actualiza la información general del sitio.</p>
        </header>

        <section className={styles.section}>
          <div className={styles.fields}>
            <FormField label="Proyecto" htmlFor="site-project" required>
              <Select
                id="site-project"
                name="projectId"
                options={MOCK_PROJECTS.map((project) => ({
                  value: project.id,
                  label: project.name,
                }))}
                defaultValue={site.projectId}
                required
              />
            </FormField>
            <SiteInput name="name" label="Nombre" value={site.name} />
            <SiteInput name="code" label="Código" value={site.code} />
            <SiteInput
              name="latitude"
              label="Latitud"
              value={site.latitude}
              type="number"
              step="any"
            />
            <SiteInput
              name="longitude"
              label="Longitud"
              value={site.longitude}
              type="number"
              step="any"
            />
            <SiteInput name="address" label="Dirección" value={site.address} />
            <SiteInput
              name="municipality"
              label="Municipio"
              value={site.municipality}
            />
            <SiteInput name="state" label="Estado" value={site.state} />
            <SiteInput name="country" label="País" value={site.country} />
          </div>
        </section>

        <footer className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar sitio</Button>
        </footer>
      </form>
    </main>
  );
}

function SiteInput({
  name,
  label,
  value: initialValue,
  ...props
}: { name: string; label: string; value: string | number } & Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "step"
>) {
  const id = `site-${name}`;
  return (
    <FormField label={label} htmlFor={id}>
      <Input {...props} id={id} name={name} defaultValue={initialValue} />
    </FormField>
  );
}

function value(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}
