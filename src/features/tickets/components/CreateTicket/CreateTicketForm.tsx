import { useEffect, useMemo, useRef, useState } from "react";
import { StatusMessage } from "../../../../components/ui/StatusMessage/StatusMessage";
import { Info } from "lucide-react";

import { Button } from "../../../../components/ui/Button/Button";
import { FileUpload } from "../../../../components/ui/FileUpload/FileUpload";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Select } from "../../../../components/ui/Select/Select";
import { Textarea } from "../../../../components/ui/Textarea/Textarea";

import {
  categoryOptions,
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
  isSubmitting?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
}

const INITIAL_FORM: CreateTicketFormData = {
  projectId: "",
  siteId: "",
  categoryId: "",
  description: "",
  images: [],
  attachments: [],
  ticketTypeId: "",
};

export function CreateTicketForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  errorMessage,
  successMessage,
}: CreateTicketFormProps) {
  const feedbackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (errorMessage || successMessage) feedbackRef.current?.focus();
  }, [errorMessage, successMessage]);
  const [formData, setFormData] = useState<CreateTicketFormData>(INITIAL_FORM);

  const [errors, setErrors] = useState<CreateTicketFormErrors>({});
  const [imagesBusy, setImagesBusy] = useState(false);
  const [documentsBusy, setDocumentsBusy] = useState(false);

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

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (imagesBusy || documentsBusy || isSubmitting) return;

    if (!validateForm()) {
      const form = event.currentTarget;
      requestAnimationFrame(() =>
        form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
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
        <fieldset className={styles.formFields} disabled={isSubmitting}>
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
                  disabled={isSubmitting}
                  value={formData.projectId}
                  options={projectOptions}
                  aria-invalid={!!errors.projectId}
                  aria-describedby={
                    errors.projectId ? "ticket-project-message" : undefined
                  }
                  onValueChange={(value) => handleProjectChange(value)}
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
                    disabled={isSubmitting || !formData.projectId}
                    aria-invalid={!!errors.siteId}
                    aria-describedby={
                      errors.siteId ? "ticket-site-message" : undefined
                    }
                    onValueChange={(value) => updateField("siteId", value)}
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
                  disabled={isSubmitting}
                  value={formData.categoryId}
                  options={categoryOptions}
                  aria-invalid={!!errors.categoryId}
                  aria-describedby={
                    errors.categoryId ? "ticket-category-message" : undefined
                  }
                  onValueChange={(value) => updateField("categoryId", value)}
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
                  disabled={isSubmitting}
                  value={formData.ticketTypeId}
                  options={ticketTypeOptions}
                  aria-invalid={!!errors.ticketTypeId}
                  aria-describedby={
                    errors.ticketTypeId ? "ticket-type-message" : undefined
                  }
                  onValueChange={(value) => updateField("ticketTypeId", value)}
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
                      maxLength={2500}
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
                    disabled={isSubmitting}
                    onBusyChange={setImagesBusy}
                    onChange={(files) => updateField("images", files)}
                  />
                </FormField>
              </div>
            </div>
          </section>

          <section
            className={styles.section}
            aria-label="Documentación del ticket"
          >
            <FormField
              label="Documentación del ticket"
              htmlFor="ticket-documents"
              helperText="Adjunta hasta 3 archivos: imágenes, texto, documentos, Excel, comprimidos u otros formatos."
            >
              <FileUpload
                inputId="ticket-documents"
                value={formData.attachments}
                disabled={isSubmitting}
                onBusyChange={setDocumentsBusy}
                onChange={(files) => updateField("attachments", files)}
                accept=""
                multiple
                maxFiles={3}
                maxSize={Infinity}
                maxTotalSize={45 * 1024 * 1024}
                label="Seleccionar documentación"
                helperText={`${formData.attachments.length} de 3 archivos seleccionados · Máximo 45 MB en total`}
              />
            </FormField>
          </section>
        </fieldset>
        {Object.values(errors).some(Boolean) && (
          <StatusMessage tone="error">
            Revisa los campos marcados antes de enviar el ticket.
          </StatusMessage>
        )}
        {(errorMessage || successMessage || isSubmitting) && (
          <div ref={feedbackRef} tabIndex={-1} className={styles.feedback}>
            <StatusMessage
              tone={
                errorMessage ? "error" : successMessage ? "success" : "info"
              }
            >
              {errorMessage || successMessage || "Enviando ticket y archivos…"}
            </StatusMessage>
          </div>
        )}
        <footer className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={imagesBusy || documentsBusy || isSubmitting}
          >
            {isSubmitting ? "Creando ticket..." : "Crear ticket"}
          </Button>
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
