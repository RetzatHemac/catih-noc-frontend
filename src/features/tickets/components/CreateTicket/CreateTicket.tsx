import { useRef, useState } from "react";

import { useNavigation } from "../../../../app/hooks/useNavigation";
import { getRequestErrorMessage } from "../../../../app/utils/requestError";

import { CreateTicketForm } from "./CreateTicketForm";

import type { CreateTicketFormData } from "../../types/createTicket.types";

import { SectionHeader } from "../../../../components/layout/Detail/SectionHeader";
import { createTicket } from "../../services/tickets.service";

import styles from "./CreateTicket.module.css";

export function CreateTicket() {
  const { goToPreviousView } = useNavigation();
  const pending = useRef(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: CreateTicketFormData) {
    if (pending.current) return;
    pending.current = true;
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await createTicket(data);

      setSuccessMessage("El ticket fue enviado correctamente.");
      navigate("/welcome");
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    } finally {
      pending.current = false;
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

      <CreateTicketForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
    </section>
  );
}
