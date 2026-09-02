import { useState } from "react";

import { useNavigation } from "../../../../app/hooks/useNavigation";
import { StatusMessage } from "../../../../components/ui/StatusMessage/StatusMessage";

import { CreateTicketForm } from "./CreateTicketForm";

import type { CreateTicketFormData } from "../../types/createTicket.types";

import { SectionHeader } from "../../../../components/layout/Detail/SectionHeader";

import styles from "./CreateTicket.module.css";

export function CreateTicket() {
  const { goToPreviousView } = useNavigation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleSubmit(data: CreateTicketFormData) {
    setSuccessMessage(
      `El ticket mock para el sitio ${data.siteId} quedó listo para enviarse.`,
    );
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
        <StatusMessage tone="success">{successMessage}</StatusMessage>
      )}

      <CreateTicketForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </section>
  );
}
