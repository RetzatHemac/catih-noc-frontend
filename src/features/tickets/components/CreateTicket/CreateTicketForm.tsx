import { useMemo, useState } from "react";
import { Info } from "lucide-react";

import { Button } from "../../../../components/ui/Button/Button";
import { FileUpload } from "../../../../components/ui/FileUpload/FileUpload";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Select } from "../../../../components/ui/Select/Select";
import { Textarea } from "../../../../components/ui/Textarea/Textarea";

import {
  categoryOptions,
  classificationOptions,
  projectOptions,
  siteOptionsByProject,
  ticketTypeOptions,
} from "../../mocks/createTicket.mock";

import type {
  CreateTicketFormData,
  CreateTicketFormErrors,
  SiteOption,
} from "../../types/createTicket.types";

import { AddSiteModal } from "./AddSiteModal";

import styles from "./CreateTicketForm.module.css";

interface CreateTicketFormProps {
  onSubmit?: (data: CreateTicketFormData) => void;

  onCancel?: () => void;
}

const INITIAL_FORM: CreateTicketFormData = {
  projectId: "",
  siteId: "",
  categoryId: "",
  description: "",
  images: [],
  ticketTypeId: "",
  classificationId: "",
};

export function CreateTicketForm({
  onSubmit,
  onCancel,
}: CreateTicketFormProps) {
  const [formData, setFormData] = useState<CreateTicketFormData>(INITIAL_FORM);

  const [errors, setErrors] = useState<CreateTicketFormErrors>({});

  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);

  const [sitesByProject, setSitesByProject] = useState(siteOptionsByProject);

  const availableSites = useMemo(
    () => sitesByProject[formData.projectId] ?? [],
    [sitesByProject, formData.projectId],
  );

  function updateField<K extends keyof CreateTicketFormData>(
    field: K,
    value: CreateTicketFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function handleProjectChange(projectId: string) {
    setFormData((current) => ({
      ...current,
      projectId,
      siteId: "",
    }));

    setErrors((current) => ({
      ...current,
      projectId: undefined,
      siteId: undefined,
    }));
  }

  function validateForm() {
    const nextErrors: CreateTicketFormErrors = {};

    if (!formData.projectId) {
      nextErrors.projectId = "Selecciona un proyecto.";
    }

    if (!formData.siteId) {
      nextErrors.siteId = "Selecciona un sitio.";
    }

    if (!formData.categoryId) {
      nextErrors.categoryId = "Selecciona una categoría.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "La descripción es obligatoria.";
    }

    if (!formData.ticketTypeId) {
      nextErrors.ticketTypeId = "Selecciona el tipo de ticket.";
    }

    if (!formData.classificationId) {
      nextErrors.classificationId = "Selecciona una clasificación.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit?.(formData);
  }

  function handleCancel() {
    setFormData(INITIAL_FORM);
    setErrors({});
    onCancel?.();
  }

  function handleSiteCreated(site: SiteOption) {
    const projectId = formData.projectId;

    setSitesByProject((current) => ({
      ...current,
      [projectId]: [...(current[projectId] ?? []), site],
    }));

    updateField("siteId", site.value);

    setIsAddSiteOpen(false);
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <section className={styles.section}>
          <div className={styles.fields}>
            <FormField
              label="Proyecto"
              htmlFor="ticket-project"
              required
              error={errors.projectId}
            >
              <Select
                id="ticket-project"
                value={formData.projectId}
                options={projectOptions}
                aria-invalid={!!errors.projectId}
                aria-describedby={errors.projectId ? "ticket-project-message" : undefined}
                onChange={(event) => handleProjectChange(event.target.value)}
              />
            </FormField>

            <FormField
              label="Sitio"
              htmlFor="ticket-site"
              required
              error={errors.siteId}
            >
              <div className={styles.siteField}>
                <Select
                  id="ticket-site"
                  value={formData.siteId}
                  options={availableSites}
                  disabled={!formData.projectId}
                  aria-invalid={!!errors.siteId}
                  aria-describedby={errors.siteId ? "ticket-site-message" : undefined}
                  onChange={(event) =>
                    updateField("siteId", event.target.value)
                  }
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!formData.projectId}
                  onClick={() => setIsAddSiteOpen(true)}
                >
                  + Agregar sitio
                </Button>
              </div>
            </FormField>

            <FormField
              label="Categoría"
              htmlFor="ticket-category"
              required
              error={errors.categoryId}
            >
              <Select
                id="ticket-category"
                value={formData.categoryId}
                options={categoryOptions}
                aria-invalid={!!errors.categoryId}
                aria-describedby={errors.categoryId ? "ticket-category-message" : undefined}
                onChange={(event) =>
                  updateField("categoryId", event.target.value)
                }
              />
            </FormField>

            <FormField
              label="Tipo de ticket"
              htmlFor="ticket-type"
              required
              error={errors.ticketTypeId}
            >
              <Select
                id="ticket-type"
                value={formData.ticketTypeId}
                options={ticketTypeOptions}
                aria-invalid={!!errors.ticketTypeId}
                aria-describedby={errors.ticketTypeId ? "ticket-type-message" : undefined}
                onChange={(event) =>
                  updateField("ticketTypeId", event.target.value)
                }
              />
            </FormField>

            <FormField
              label="Clasificación"
              htmlFor="ticket-classification"
              required
              error={errors.classificationId}
            >
              <Select
                id="ticket-classification"
                value={formData.classificationId}
                options={classificationOptions}
                aria-invalid={!!errors.classificationId}
                aria-describedby={errors.classificationId ? "ticket-classification-message" : undefined}
                onChange={(event) =>
                  updateField("classificationId", event.target.value)
                }
              />
            </FormField>

            <div className={styles.fullWidth}>
              <FormField
                label="Descripción"
                htmlFor="ticket-description"
                required
                error={errors.description}
                helperText="Describe el problema, ubicación, síntomas observados y cualquier información útil para su atención."
              >
                <div className={styles.description}>
                  <Textarea
                    id="ticket-description"
                    value={formData.description}
                    placeholder="Describe el problema..."
                    aria-invalid={!!errors.description}
                    aria-describedby="ticket-description-message"
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                  />

                  <span
                    className={styles.info}
                    title="Incluye toda la información relevante para facilitar la atención."
                  >
                    <Info size={16} aria-hidden="true" />
                  </span>
                </div>
              </FormField>
            </div>

            <div className={styles.fullWidth}>
              <FormField
                label="Imagen relacionada"
                helperText="Puedes adjuntar una imagen relacionada con el ticket."
              >
                <FileUpload
                  value={formData.images}
                  onChange={(files) => updateField("images", files)}
                />
              </FormField>
            </div>
          </div>
        </section>

        <footer className={styles.actions}>
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>

          <Button type="submit">Crear ticket</Button>
        </footer>
      </form>

      <AddSiteModal
        open={isAddSiteOpen}
        onClose={() => setIsAddSiteOpen(false)}
        projectId={formData.projectId}
        onSiteCreated={handleSiteCreated}
      />
    </>
  );
}
