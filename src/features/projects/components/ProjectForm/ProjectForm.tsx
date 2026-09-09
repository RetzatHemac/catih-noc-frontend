import { useState, type FormEvent } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Input } from "../../../../components/ui/Input/Input";
import { Select } from "../../../../components/ui/Select/Select";
import { Textarea } from "../../../../components/ui/Textarea/Textarea";
import {
  administratorOptions,
  attentionUnitOptions,
  clientOptions,
  clientTypeOptions,
  contractTypeOptions,
  coverageOptions,
  departmentOptions,
  infrastructureOptions,
  slaTemplateOptions,
} from "../../config/projectOptions";
import type { AttentionTime, ProjectRecord } from "../../types/project.types";

import styles from "./ProjectForm.module.css";

interface ProjectFormProps {
  project?: ProjectRecord;
  onSave: (project: ProjectRecord) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [preventive, setPreventive] = useState(
    project?.services.preventive ?? false,
  );
  const [catih, setCatih] = useState(project?.services.catih ?? false);
  const [phone, setPhone] = useState(project?.services.phone ?? false);
  const [noc, setNoc] = useState(project?.services.noc ?? false);
  const [infrastructure, setInfrastructure] = useState(
    project?.infrastructureIncluded ?? false,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const endDate = text(data, "endDate");
    const slaTemplate = text(data, "slaTemplate");

    onSave({
      id: project?.id ?? `project-${Date.now()}`,
      kind: project?.kind ?? "Póliza",
      name: text(data, "name"),
      shortName: text(data, "shortName"),
      client: text(data, "client"),
      contractId: text(data, "contractId"),
      contractTemplate: slaTemplate,
      status: endDate && endDate < today() ? "expired" : "active",
      endDate,
      slaTemplate,
      contractType: text(data, "contractType"),
      department: text(data, "department"),
      ovProject: text(data, "ovProject"),
      projectNumber: text(data, "projectNumber"),
      clientType: text(data, "clientType"),
      startDate: text(data, "startDate"),
      remoteAttention: attention(data, "remote"),
      onsiteAttention: attention(data, "onsite"),
      resolutionTime: attention(data, "resolution"),
      contactName: text(data, "contactName"),
      contactPhone: text(data, "contactPhone"),
      contactEmail: text(data, "contactEmail"),
      services: {
        preventive,
        preventiveEvents: preventive
          ? number(data, "preventiveEvents")
          : undefined,
        catih,
        unlimitedTickets: catih
          ? text(data, "unlimitedTickets") === "yes"
          : undefined,
        phone,
        authorizedTickets: phone
          ? number(data, "authorizedTickets")
          : undefined,
        noc,
        serviceLevel: noc ? number(data, "serviceLevel") : undefined,
      },
      infrastructureIncluded: infrastructure,
      infrastructureServices: infrastructure
        ? infrastructureOptions.filter((option) => data.has(`infra-${option}`))
        : [],
      additionalInfrastructure: infrastructure
        ? text(data, "additionalInfrastructure")
        : "",
      coverages: Object.fromEntries(
        coverageOptions.map((option) => [
          option,
          text(data, `coverage-${option}`) === "yes",
        ]),
      ),
      additionalCoverages: text(data, "additionalCoverages"),
      serviceAdministrator: text(data, "serviceAdministrator"),
      projectAdministrator: text(data, "projectAdministrator"),
      implementationReasons: project?.implementationReasons,
      projectAnalyst: project?.projectAnalyst,
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <header className={styles.heading}>
        <h2>{project ? "Editar proyecto" : "Nuevo proyecto"}</h2>
        <p>Los campos marcados con * son obligatorios.</p>
      </header>

      <FormSection title="Información del proyecto">
        <div className={styles.fields}>
          <SelectField
            name="slaTemplate"
            label="Plantilla SLA"
            options={slaTemplateOptions}
            value={project?.slaTemplate}
            required
          />
          <SelectField
            name="contractType"
            label="Tipo de contrato"
            options={contractTypeOptions}
            value={project?.contractType}
            required
          />
          <InputField
            name="contractId"
            label="Id de contrato"
            value={project?.contractId}
            placeholder="CON-12345-A1B2"
            pattern="CON-[0-9]{5}-[A-Za-z0-9]{4}"
            required
          />
          <SelectField
            name="department"
            label="Departamento"
            options={departmentOptions}
            value={project?.department}
            required
          />
          <InputField
            name="name"
            label="Nombre del contrato"
            value={project?.name}
            required
          />
          <InputField
            name="shortName"
            label="Nombre corto"
            value={project?.shortName}
            required
          />
          <InputField
            name="ovProject"
            label="OV proyecto"
            value={project?.ovProject}
          />
          <InputField
            name="projectNumber"
            label="Número de proyecto"
            value={project?.projectNumber}
            required
          />
          <SelectField
            name="client"
            label="Cliente"
            options={clientOptions}
            value={project?.client}
            required
          />
          <SelectField
            name="clientType"
            label="Tipo de cliente"
            options={clientTypeOptions}
            value={project?.clientType}
          />
          <InputField
            name="startDate"
            label="Fecha de inicio de contrato"
            value={project?.startDate}
            type="date"
          />
          <InputField
            name="endDate"
            label="Fecha de fin de contrato"
            value={project?.endDate}
            type="date"
          />
        </div>
      </FormSection>

      <FormSection title="Tiempos de atención">
        <div className={styles.fields}>
          <TimeField
            name="remote"
            label="Tiempo de atención remota"
            value={project?.remoteAttention}
          />
          <TimeField
            name="onsite"
            label="Tiempo de atención en sitio"
            value={project?.onsiteAttention}
          />
          <TimeField
            name="resolution"
            label="Tiempo de resolución de falla"
            value={project?.resolutionTime}
          />
        </div>
      </FormSection>

      <FormSection title="Cliente">
        <div className={styles.fields}>
          <InputField
            name="contactName"
            label="Nombre contacto"
            value={project?.contactName}
            required
          />
          <InputField
            name="contactPhone"
            label="Número de teléfono cliente"
            value={project?.contactPhone}
            type="tel"
            inputMode="tel"
            required
          />
          <InputField
            name="contactEmail"
            label="Correo cliente"
            value={project?.contactEmail}
            type="email"
            required
          />
        </div>
      </FormSection>

      <FormSection title="Servicios incluidos">
        <div className={styles.options}>
          <ServiceOption
            checked={preventive}
            onChange={setPreventive}
            label="Servicio de mantenimiento preventivo"
          >
            <InputField
              name="preventiveEvents"
              label="Número de eventos preventivos"
              value={project?.services.preventiveEvents}
              type="number"
              min="0"
              required
            />
          </ServiceOption>
          <ServiceOption
            checked={catih}
            onChange={setCatih}
            label="Servicio de CATiH"
          >
            <RadioChoice
              name="unlimitedTickets"
              label="Tickets ilimitados"
              initial={project?.services.unlimitedTickets}
            />
          </ServiceOption>
          <ServiceOption
            checked={phone}
            onChange={setPhone}
            label="Atención telefónica"
          >
            <InputField
              name="authorizedTickets"
              label="Tickets autorizados"
              value={project?.services.authorizedTickets}
              type="number"
              min="0"
              required
            />
          </ServiceOption>
          <ServiceOption
            checked={noc}
            onChange={setNoc}
            label="Servicios de NOC"
          >
            <InputField
              name="serviceLevel"
              label="Número de nivel de servicio"
              value={project?.services.serviceLevel}
              type="number"
              min="0"
              required
            />
          </ServiceOption>
        </div>
      </FormSection>

      <FormSection title="Servicio de infraestructura">
        <div className={styles.fields}>
          <FormField
            label="¿Incluye servicio de infraestructura?"
            htmlFor="project-infrastructure"
          >
            <Select
              id="project-infrastructure"
              value={infrastructure ? "yes" : "no"}
              options={[
                { value: "yes", label: "Sí incluye" },
                { value: "no", label: "No incluye" },
              ]}
              onChange={(event) =>
                setInfrastructure(event.target.value === "yes")
              }
            />
          </FormField>
          {infrastructure && (
            <div className={styles.fullWidth}>
              <div className={styles.options}>
                {infrastructureOptions.map((option) => (
                  <label key={option} className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      name={`infra-${option}`}
                      defaultChecked={project?.infrastructureServices.includes(
                        option,
                      )}
                    />
                    {option}
                  </label>
                ))}
              </div>
              <FormField
                label="Servicios adicionales"
                htmlFor="additional-infrastructure"
              >
                <Textarea
                  id="additional-infrastructure"
                  name="additionalInfrastructure"
                  defaultValue={project?.additionalInfrastructure}
                />
              </FormField>
            </div>
          )}
        </div>
      </FormSection>

      <FormSection title="Coberturas">
        <div className={styles.options}>
          {coverageOptions.map((option) => (
            <div key={option} className={styles.coverageRow}>
              <span>{option}</span>
              <RadioChoice
                name={`coverage-${option}`}
                label={option}
                initial={project?.coverages[option]}
              />
            </div>
          ))}
        </div>
        <FormField
          label="Coberturas adicionales"
          htmlFor="additional-coverages"
        >
          <Textarea
            id="additional-coverages"
            name="additionalCoverages"
            defaultValue={project?.additionalCoverages}
          />
        </FormField>
      </FormSection>

      <FormSection title="Administración">
        <div className={styles.fields}>
          <SelectField
            name="serviceAdministrator"
            label="Administrador de servicio"
            options={administratorOptions}
            value={project?.serviceAdministrator}
            required
          />
          <InputField
            name="projectAdministrator"
            label="Administrador de proyecto"
            value={project?.projectAdministrator}
            required
          />
        </div>
      </FormSection>

      <footer className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar proyecto</Button>
      </footer>
    </form>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

interface InputFieldProps extends Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "pattern" | "placeholder" | "min" | "inputMode"
> {
  name: string;
  label: string;
  value?: string | number;
  required?: boolean;
}

function InputField({
  name,
  label,
  value,
  required,
  ...props
}: InputFieldProps) {
  const id = `project-${name}`;
  return (
    <FormField label={label} htmlFor={id} required={required}>
      <Input
        {...props}
        id={id}
        name={name}
        defaultValue={value}
        required={required}
      />
    </FormField>
  );
}

function SelectField({
  name,
  label,
  options,
  value,
  required,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  value?: string;
  required?: boolean;
}) {
  const id = `project-${name}`;
  return (
    <FormField label={label} htmlFor={id} required={required}>
      <Select
        id={id}
        name={name}
        options={options}
        defaultValue={value ?? ""}
        required={required}
      />
    </FormField>
  );
}

function TimeField({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value?: AttentionTime;
}) {
  return (
    <FormField label={label} htmlFor={`project-${name}-value`} required>
      <div className={styles.timeField}>
        <Input
          id={`project-${name}-value`}
          name={`${name}Value`}
          type="number"
          min="0"
          step="1"
          defaultValue={value?.value}
          required
        />
        <Select
          name={`${name}Unit`}
          aria-label={`Unidad para ${label}`}
          options={attentionUnitOptions}
          defaultValue={value?.unit ?? ""}
          required
        />
      </div>
    </FormField>
  );
}

function ServiceOption({
  checked,
  onChange,
  label,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.optionCard}>
      <label className={styles.checkLabel}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        {label}
      </label>
      {checked && children}
    </div>
  );
}

function RadioChoice({
  name,
  label,
  initial,
}: {
  name: string;
  label: string;
  initial?: boolean;
}) {
  return (
    <fieldset className={styles.inlineOptions} aria-label={label}>
      <label className={styles.radioLabel}>
        <input
          type="radio"
          name={name}
          value="yes"
          defaultChecked={initial === true}
          required
        />
        Sí
      </label>
      <label className={styles.radioLabel}>
        <input
          type="radio"
          name={name}
          value="no"
          defaultChecked={initial === false}
          required
        />
        No
      </label>
    </fieldset>
  );
}

function text(data: FormData, key: string): string {
  return String(data.get(key) ?? "").trim();
}
function number(data: FormData, key: string): number {
  return Number(data.get(key) ?? 0);
}
function attention(data: FormData, prefix: string): AttentionTime {
  return {
    value: number(data, `${prefix}Value`),
    unit: text(data, `${prefix}Unit`),
  };
}
function today(): string {
  return new Date().toISOString().slice(0, 10);
}
