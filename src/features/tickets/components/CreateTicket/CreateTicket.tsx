import { useNavigation } from "../../../../app/providers/NavigationProvider";

import { CreateTicketForm } from "./CreateTicketForm";

import type { CreateTicketFormData } from "../../types/createTicket.types";

import { SectionHeader } from "../../../../components/layout/Detail/SectionHeader";

import styles from "./CreateTicket.module.css";

export function CreateTicket() {
  const { goToPreviousView } = useNavigation();

  function handleSubmit(data: CreateTicketFormData) {
    console.log("Ticket listo para enviar:", data);
  }

  function handleCancel() {
    console.log("Creación cancelada");
    goToPreviousView();
  }

  return (
    <section className={styles.page}>
      <SectionHeader
        title="Datos del ticket"
        description="Completa la información necesaria para registrar el ticket."
      />

      <CreateTicketForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </section>
  );
}
