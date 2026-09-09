import type { FormEvent, ReactNode } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Input } from "../../../../components/ui/Input/Input";
import { Select } from "../../../../components/ui/Select/Select";
import { Textarea } from "../../../../components/ui/Textarea/Textarea";
import {
  clientOptions,
  clientTypeOptions,
  departmentOptions,
} from "../../config/projectOptions";
import type { ProjectRecord } from "../../types/project.types";

import styles from "../ProjectForm/ProjectForm.module.css";

interface ImplementationFormProps {
  onSave: (project: ProjectRecord) => void;
  onCancel: () => void;
}

export function ImplementationForm({
  onSave,
  onCancel,
}: ImplementationFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const endDate = value(data, "endDate");

    onSave({
      id: `implementation-${Date.now()}`,
      kind: "Implementación",
      name: value(data, "name"),
      shortName: value(data, "shortName"),
      client: value(data, "client"),
      contractId: value(data, "contractId"),
      contractTemplate: "IMPL",
      status:
        endDate && endDate < new Date().toISOString().slice(0, 10)
          ? "expired"
          : "active",
      endDate,
      slaTemplate: "N/A",
      contractType: "Implementación",
      department: value(data, "department"),
      ovProject: value(data, "ovProject"),
      projectNumber: value(data, "projectNumber"),
      clientType: value(data, "clientType"),
      startDate: "",
      remoteAttention: { value: 0, unit: "na" },
      onsiteAttention: { value: 0, unit: "na" },
      resolutionTime: { value: 0, unit: "na" },
      contactName: value(data, "contactName"),
      contactPhone: value(data, "contactPhone"),
      contactEmail: value(data, "contactEmail"),
      services: { preventive: false, catih: false, phone: false, noc: false },
      infrastructureIncluded: false,
      infrastructureServices: [],
      additionalInfrastructure: "",
      coverages: {},
      additionalCoverages: "",
      serviceAdministrator: value(data, "projectAnalyst"),
      projectAdministrator: value(data, "projectAdministrator"),
      implementationReasons: value(data, "reasons"),
      projectAnalyst: value(data, "projectAnalyst"),
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <header className={styles.heading}>
        <h2>Nueva implementación</h2>
        <p>Los campos marcados con * son obligatorios.</p>
      </header>

      <Section title="Información del proyecto">
        <div className={styles.fields}>
          <Field
            name="contractId"
            label="Id de contrato"
            placeholder="CON-12345-A1B2"
            pattern="CON-[0-9]{5}-[A-Za-z0-9]{4}"
            required
          />
          <SelectField
            name="department"
            label="Departamento"
            options={departmentOptions}
            required
          />
          <Field name="name" label="Nombre del contrato" required />
          <Field name="shortName" label="Nombre corto" required />
          <Field name="ovProject" label="OV proyecto" />
          <Field name="projectNumber" label="Número de proyecto" required />
          <SelectField
            name="client"
            label="Cliente"
            options={clientOptions}
            required
          />
          <SelectField
            name="clientType"
            label="Tipo de cliente"
            options={clientTypeOptions}
          />
          <Field
            name="endDate"
            label="Fecha de término de implementación"
            type="date"
          />
        </div>
      </Section>

      <Section title="Cliente">
        <div className={styles.fields}>
          <Field name="contactName" label="Nombre contacto" required />
          <Field
            name="contactPhone"
            label="Número de teléfono cliente"
            type="tel"
            required
          />
          <Field
            name="contactEmail"
            label="Correo cliente"
            type="email"
            required
          />
        </div>
      </Section>

      <Section title="Motivos">
        <FormField
          label="Motivos de la implementación"
          htmlFor="implementation-reasons"
        >
          <Textarea id="implementation-reasons" name="reasons" rows={5} />
        </FormField>
      </Section>

      <Section title="Administración">
        <div className={styles.fields}>
          <Field name="projectAnalyst" label="Analista de proyecto" required />
          <Field
            name="projectAdministrator"
            label="Administrador de proyecto"
            required
          />
        </div>
      </Section>

      <footer className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar implementación</Button>
      </footer>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Field({
  name,
  label,
  required,
  ...props
}: { name: string; label: string; required?: boolean } & Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "pattern" | "placeholder"
>) {
  const id = `implementation-${name}`;
  return (
    <FormField label={label} htmlFor={id} required={required}>
      <Input {...props} id={id} name={name} required={required} />
    </FormField>
  );
}

function SelectField({
  name,
  label,
  options,
  required,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  const id = `implementation-${name}`;
  return (
    <FormField label={label} htmlFor={id} required={required}>
      <Select id={id} name={name} options={options} required={required} />
    </FormField>
  );
}

function value(data: FormData, key: string): string {
  return String(data.get(key) ?? "").trim();
}
