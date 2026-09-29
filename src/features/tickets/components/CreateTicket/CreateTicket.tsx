import { useState } from "react";

import { useNavigation } from "../../../../app/hooks/useNavigation";
import { StatusMessage } from "../../../../components/ui/StatusMessage/StatusMessage";

import { CreateTicketForm } from "./CreateTicketForm";

import type { CreateTicketFormData } from "../../types/createTicket.types";

import { SectionHeader } from "../../../../components/layout/Detail/SectionHeader";
import axios from "axios";
import { createTicket } from "../../services/tickets.service";

import styles from "./CreateTicket.module.css";

export function CreateTicket() {
  const { goToPreviousView } = useNavigation();

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    data: CreateTicketFormData,
  ) {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await createTicket(data);

      console.warn("Respuesta de creación:", response);

      setSuccessMessage(
        "El ticket fue enviado correctamente.",
      );
    } catch (error) {
      console.error("Error creando ticket:", error);
      if (axios.isAxiosError(error)) {
        console.error("STATUS:", error.response?.status);
        console.error("DATA:", error.response?.data);
      }

      setErrorMessage(
        "No fue posible crear el ticket.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    goToPreviousView();
  }

  return (
    <section className={styles.page}>
      <SectionHeader
        title="Datos del ticket"
        description="Completa la información necesaria para registrar el ticket."
      />

      {successMessage && (
        <StatusMessage tone="success">
          {successMessage}
        </StatusMessage>
      )}

      {errorMessage && (
        <StatusMessage tone="error">
          {errorMessage}
        </StatusMessage>
      )}

      <CreateTicketForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}
