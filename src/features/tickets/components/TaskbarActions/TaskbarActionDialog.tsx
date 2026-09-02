import { useAuth } from "../../../../auth";

import type { TaskbarActionId } from "../../config/taskbarActions";
import type { TicketAttachment } from "../../types/ticketDetail.types";
import { useTicketWorkspace } from "../../context/useTicketWorkspace";
import { downloadTicketReport } from "../../utils/downloadTicketReport";

import { ActivityActionModal } from "./ActivityActionModal";
import { ChatDialog, type ChatMessageFormValue } from "./ChatDialog";
import { ConfirmActionDialog } from "./ConfirmActionDialog";
import {
  InterventionActionModal,
  type InterventionFormValue,
} from "./InterventionActionModal";
import {
  ImageUploadActionModal,
  type ImageUploadFormValue,
} from "./ImageUploadActionModal";
import {
  InventoryActionModal,
  type InventoryFormValue,
} from "./InventoryActionModal";
import { NotesDialog } from "./NotesDialog";
import { PauseTicketDialog } from "./PauseTicketDialog";
import { ReportsDialog } from "./ReportsDialog";
import { ScheduleVisitDialog } from "./ScheduleVisitDialog";
import { TicketRelationsDialog } from "./TicketRelationsDialog";

interface TaskbarActionDialogProps {
  actionId: TaskbarActionId | null;
  onClose: () => void;
}

export function TaskbarActionDialog({
  actionId,
  onClose,
}: TaskbarActionDialogProps) {
  const { user } = useAuth();
  const { ticket, updateTicket, setFeedback } = useTicketWorkspace();

  if (!actionId || !ticket) return null;

  function complete(message: string) {
    setFeedback({ message, tone: "success" });
    onClose();
  }

  switch (actionId) {
    case "open-chat":
      return (
        <ChatDialog
          messages={ticket.chatMessages}
          currentUserName={user.name}
          onClose={onClose}
          onSubmit={(value) => {
            addChatMessage(value, user.name, updateTicket);
            setFeedback({
              message: "El mensaje se agregó al chat del ticket.",
              tone: "success",
            });
          }}
        />
      );

    case "manage-notes":
      return (
        <NotesDialog
          notes={ticket.notes}
          onClose={onClose}
          onSubmit={(comment) => {
            updateTicket((current) => ({
              ...current,
              notes: [
                ...current.notes,
                {
                  id: createMockId("note"),
                  author: user.name,
                  createdAt: getMockDateTime(),
                  comment,
                },
              ],
            }));
            setFeedback({
              message: "La nota se guardó correctamente.",
              tone: "success",
            });
          }}
        />
      );

    case "upload-images":
      return (
        <ImageUploadActionModal
          imageGroups={ticket.imageGroups}
          onClose={onClose}
          onSubmit={(value) => {
            addImages(value, updateTicket);
            complete(
              `${value.files.length} ${value.files.length === 1 ? "imagen agregada" : "imágenes agregadas"} correctamente.`,
            );
          }}
        />
      );

    case "report-activity":
      return (
        <ActivityActionModal
          onClose={onClose}
          onSubmit={({ scope, message }) => {
            const timestamp = getMockTimestamp();
            const group =
              scope === "remote" ? "remoteActivities" : "onsiteActivities";
            updateTicket((current) => ({
              ...current,
              [group]: [
                ...current[group],
                {
                  id: createMockId("activity"),
                  ...timestamp,
                  person: user.name,
                  message,
                },
              ],
            }));
            complete(
              `La actividad ${scope === "remote" ? "remota" : "en sitio"} se agregó correctamente.`,
            );
          }}
        />
      );

    case "manage-inventory":
      return (
        <InventoryActionModal
          onClose={onClose}
          onSubmit={(value) => {
            addReplacement(value, updateTicket);
            complete("El inventario se registró correctamente.");
          }}
        />
      );

    case "report-intervention":
      return (
        <InterventionActionModal
          onClose={onClose}
          onSubmit={(value) => {
            addIntervention(value, updateTicket);
            complete("La intervención se registró correctamente.");
          }}
        />
      );

    case "pause-ticket":
      return (
        <PauseTicketDialog
          onClose={onClose}
          onSubmit={({ dependency, reasonType, detail }) => {
            updateTicket((current) => ({
              ...current,
              status: "PAUSADO",
              pauseReasons: [
                ...current.pauseReasons,
                {
                  id: createMockId("pause"),
                  ...getMockTimestamp(),
                  person: user.name,
                  dependency,
                  reasonType,
                  message: detail,
                },
              ],
            }));
            complete("El ticket se pausó correctamente en el mock.");
          }}
        />
      );

    case "schedule-visit":
      return (
        <ScheduleVisitDialog
          initialUserId={ticket.scheduledVisit?.userId}
          initialScheduledAt={ticket.scheduledVisit?.scheduledAt}
          onClose={onClose}
          onSubmit={(visit) => {
            updateTicket((current) => ({
              ...current,
              scheduledVisit: visit,
              scheduledAt: visit.scheduledAt,
              onsiteAttention: {
                ...current.onsiteAttention,
                provider: visit.userName,
              },
            }));
            complete("La visita del proveedor quedó agendada.");
          }}
        />
      );

    case "manage-related-tickets":
      return (
        <TicketRelationsDialog
          currentTicketId={ticket.id}
          relations={ticket.relatedTickets}
          onClose={onClose}
          onSubmit={(relation) => {
            updateTicket((current) => ({
              ...current,
              relatedTickets: [
                ...current.relatedTickets,
                { id: createMockId("related"), ...relation },
              ],
            }));
            complete(`El ticket ${relation.identifier} quedó relacionado.`);
          }}
        />
      );

    case "duplicate-ticket":
      return (
        <ConfirmActionDialog
          title="Duplicar ticket"
          description={`Se creará una copia mock de ${ticket.identifier}. ¿Deseas continuar?`}
          confirmLabel="Duplicar"
          onClose={onClose}
          onConfirm={() =>
            complete(`Se simuló la duplicación de ${ticket.identifier}.`)
          }
        />
      );

    case "close-ticket":
      return (
        <ConfirmActionDialog
          title="Cerrar ticket"
          description={`Esta acción cambiará ${ticket.identifier} a cerrado. ¿Deseas continuar?`}
          confirmLabel="Cerrar ticket"
          danger
          onClose={onClose}
          onConfirm={() => {
            updateTicket((current) => ({
              ...current,
              status: "CERRADO",
              closedAt: getMockDateTime(),
            }));
            complete("El ticket se cerró correctamente en el mock.");
          }}
        />
      );

    case "download-reports":
      return (
        <ReportsDialog
          onClose={onClose}
          onDownload={(reportId) => {
            downloadTicketReport(ticket, reportId);
            setFeedback({
              message: "El reporte se descargó correctamente.",
              tone: "success",
            });
          }}
        />
      );
  }
}

type UpdateTicket = ReturnType<typeof useTicketWorkspace>["updateTicket"];

function addChatMessage(
  value: ChatMessageFormValue,
  author: string,
  updateTicket: UpdateTicket,
) {
  const attachments: TicketAttachment[] = value.files.map((file, index) => ({
    id: `${createMockId("attachment")}-${index}`,
    type: file.type.startsWith("video/") ? "video" : "image",
    name: file.name,
    url: URL.createObjectURL(file),
  }));

  updateTicket((current) => ({
    ...current,
    chatMessages: [
      ...current.chatMessages,
      {
        id: createMockId("message"),
        author,
        createdAt: getMockDateTime(),
        message: value.message,
        attachments,
      },
    ],
  }));
}

function addImages(value: ImageUploadFormValue, updateTicket: UpdateTicket) {
  updateTicket((current) => ({
    ...current,
    imageGroups: {
      ...current.imageGroups,
      [value.group]: [
        ...current.imageGroups[value.group],
        ...value.files.map((file, index) => ({
          id: `${createMockId("image")}-${index}`,
          url: URL.createObjectURL(file),
          description: value.description.trim() || file.name,
        })),
      ],
    },
  }));
}

function addReplacement(value: InventoryFormValue, updateTicket: UpdateTicket) {
  updateTicket((current) => ({
    ...current,
    replacedEquipment: [
      ...current.replacedEquipment,
      { id: createMockId("replacement"), ...value },
    ],
  }));
}

function addIntervention(
  value: InterventionFormValue,
  updateTicket: UpdateTicket,
) {
  updateTicket((current) => ({
    ...current,
    intervenedEquipment: [
      ...current.intervenedEquipment,
      { id: createMockId("intervention"), ...value },
    ],
  }));
}

function createMockId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

function getMockDateTime(): string {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

function getMockTimestamp(): { date: string; time: string } {
  const dateTime = getMockDateTime();

  return { date: dateTime.slice(0, 10), time: dateTime.slice(11, 16) };
}
