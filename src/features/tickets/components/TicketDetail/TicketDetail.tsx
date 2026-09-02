import { useState } from "react";

import { useAuth } from "../../../../auth";

import { CopyAuxiliaryTextModal } from "./CopyAuxiliaryTextModal/CopyAuxiliaryTextModal";
import type {
  ReplacedEquipment,
  TicketDetail as TicketDetailType,
} from "../../types/ticketDetail.types";
import { OnsiteAttention } from "./OnSiteAttention/OnSiteAttention";

import { SLASection } from "./SLASection/SLASection";
import { DetailSection } from "../../../../components/patterns/DetailSection/DetailSection";
import { DescriptionSection } from "./DescriptionSection/DescriptionSection";
import { ProblemImages } from "./ProblemImages/ProblemImages";
import { SiteLocation } from "./SiteLocation/SiteLocation";
import { ActivityList } from "../../../../components/patterns/ActivityList/ActivityList";
import { ImageGallery } from "../../../../components/patterns/ImageGallery/ImageGallery";
import { RelatedTickets } from "./RelatedTickets/RelatedTickets";
import { ReplacedEquipmentTable } from "./ReplacedEquipmentTable/ReplacedEquipmentTable";
import { IntervenedEquipmentTable } from "./IntervenedEquipmentTable/IntervenedEquipmentTable";
import { MaterialsTable } from "./MaterialsTable/MaterialsTable";
import { StatusMessage } from "../../../../components/ui/StatusMessage/StatusMessage";
import { getTicketDetailCapabilities } from "../../policies/ticketAccess";
import { useTicketWorkspace } from "../../context/useTicketWorkspace";

import {
  GeneralInformation,
  type GeneralInformationField,
} from "./GeneralInformation/GeneralInformation";

import { TicketDetailHeader } from "./TicketDetailHeader/TicketDetailHeader";

import styles from "./TicketDetail.module.css";

export function TicketDetail() {
  const { user } = useAuth();
  const {
    ticket: currentTicket,
    updateTicket: setCurrentTicket,
    feedback,
    setFeedback,
  } = useTicketWorkspace();
  const [isAuxiliaryTextOpen, setAuxiliaryTextOpen] = useState(false);
  type ImageGroupKey = keyof TicketDetailType["imageGroups"];

  if (!currentTicket) {
    return null;
  }

  const ticketIdentifier = currentTicket.identifier;
  const capabilities = getTicketDetailCapabilities(user, currentTicket.status);

  function handleStartTicket() {
    setCurrentTicket((current) => ({
      ...current,
      status: "EN_PROCESO",
    }));
    setFeedback({
      message: `El ticket ${ticketIdentifier} se inició correctamente en el mock.`,
      tone: "success",
    });
  }

  function handleDeleteTicket() {
    const shouldDelete = window.confirm(
      `¿Deseas eliminar el ticket ${ticketIdentifier}?`,
    );

    if (!shouldDelete) {
      return;
    }

    setFeedback({
      message: `La eliminación de ${ticketIdentifier} se simuló correctamente.`,
      tone: "success",
    });
  }

  function handleCloseOnsiteSla(slaKey: "first" | "second") {
    const completedAt = new Date().toLocaleString("es-MX");

    setCurrentTicket((current) => ({
      ...current,

      sla: {
        ...current.sla,

        [slaKey]: {
          ...current.sla[slaKey],
          onsiteStatus: "COMPLETED",
          onsiteActual: completedAt,
        },
      },
    }));
  }

  function handleProviderUpdate(value: string) {
    setCurrentTicket((current) => ({
      ...current,

      onsiteAttention: {
        ...current.onsiteAttention,
        provider: value || undefined,
      },
    }));
  }

  function handleUnassignProvider() {
    setCurrentTicket((current) => ({
      ...current,

      onsiteAttention: {
        ...current.onsiteAttention,
        provider: undefined,
      },
    }));
  }

  function handleGeneralInformationUpdate(
    field: GeneralInformationField,
    value: string,
  ) {
    setCurrentTicket((current) => {
      switch (field) {
        case "site.name":
          return {
            ...current,
            site: {
              ...current.site,
              name: value,
            },
          };

        case "site.municipality":
          return {
            ...current,
            site: {
              ...current.site,
              municipality: value,
            },
          };

        case "site.address":
          return {
            ...current,
            site: {
              ...current.site,
              address: value,
            },
          };

        case "site.latitude": {
          const latitude = Number(value);

          if (Number.isNaN(latitude)) {
            return current;
          }

          return {
            ...current,
            site: {
              ...current.site,
              latitude,
            },
            location: {
              ...current.location,
              latitude,
            },
          };
        }

        case "site.longitude": {
          const longitude = Number(value);

          if (Number.isNaN(longitude)) {
            return current;
          }

          return {
            ...current,
            site: {
              ...current.site,
              longitude,
            },
            location: {
              ...current.location,
              longitude,
            },
          };
        }

        case "category":
          return {
            ...current,
            category: value,
          };

        case "problemType":
          return {
            ...current,
            problemType: value,
          };

        case "ticketType":
          return {
            ...current,
            ticketType: value,
          };

        case "assignedTo":
          return {
            ...current,
            assignedTo: value,
          };

        case "resolvedAt":
          return {
            ...current,
            resolvedAt: value || undefined,
          };

        default:
          return current;
      }
    });
  }

  function handleDescriptionUpdate(description: string) {
    setCurrentTicket((current) => ({ ...current, description }));
    setFeedback({
      message: "La descripción se actualizó correctamente.",
      tone: "success",
    });
  }

  function handleEditActivity(
    group: "remoteActivities" | "onsiteActivities",
    activityId: string,
    message: string,
  ) {
    setCurrentTicket((current) => ({
      ...current,

      [group]: current[group].map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              message,
            }
          : activity,
      ),
    }));
  }

  function handleDeleteActivity(
    group: "remoteActivities" | "onsiteActivities",
    activityId: string,
  ) {
    if (!window.confirm("¿Deseas eliminar esta actividad?")) {
      return;
    }

    setCurrentTicket((current) => ({
      ...current,

      [group]: current[group].filter((activity) => activity.id !== activityId),
    }));
    setFeedback({
      message: "La actividad remota se eliminó correctamente.",
      tone: "success",
    });
  }

  function handleDeleteImage(group: ImageGroupKey, imageId: string) {
    if (!window.confirm("¿Deseas eliminar esta imagen?")) {
      return;
    }

    setCurrentTicket((current) => ({
      ...current,

      imageGroups: {
        ...current.imageGroups,

        [group]: current.imageGroups[group].filter(
          (image) => image.id !== imageId,
        ),
      },
    }));
    setFeedback({
      message: "La imagen se eliminó correctamente.",
      tone: "success",
    });
  }

  function handleEditReplacedEquipment(equipment: ReplacedEquipment) {
    setFeedback({
      message: `La edición del equipo ${equipment.damagedSerial} está preparada para conectarse al formulario correspondiente.`,
      tone: "info",
    });
  }

  function handleDeleteReplacedEquipment(equipmentId: string) {
    if (!window.confirm("¿Deseas eliminar este equipo reemplazado?")) {
      return;
    }

    setCurrentTicket((current) => ({
      ...current,

      replacedEquipment: current.replacedEquipment.filter(
        (equipment) => equipment.id !== equipmentId,
      ),
    }));
    setFeedback({
      message: "El equipo reemplazado se eliminó correctamente.",
      tone: "success",
    });
  }

  function handleDeleteIntervenedEquipment(equipmentId: string) {
    if (!window.confirm("¿Deseas eliminar este equipo intervenido?")) {
      return;
    }

    setCurrentTicket((current) => ({
      ...current,

      intervenedEquipment: current.intervenedEquipment.filter(
        (equipment) => equipment.id !== equipmentId,
      ),
    }));
    setFeedback({
      message: "El equipo intervenido se eliminó correctamente.",
      tone: "success",
    });
  }

  function handleMaterialReviewChange(materialId: string, reviewed: boolean) {
    setCurrentTicket((current) => ({
      ...current,

      materials: current.materials.map((material) =>
        material.id === materialId
          ? {
              ...material,
              reviewed,
            }
          : material,
      ),
    }));
  }

  return (
    <section className={styles.page}>
      <TicketDetailHeader
        ticket={currentTicket}
        onCopyAuxiliaryText={() => setAuxiliaryTextOpen(true)}
        canStartTicket={capabilities.canStartTicket}
        canDeleteTicket={capabilities.canDeleteTicket}
        onStartTicket={handleStartTicket}
        onDeleteTicket={handleDeleteTicket}
      />

      {feedback && (
        <StatusMessage tone={feedback.tone}>{feedback.message}</StatusMessage>
      )}

      <CopyAuxiliaryTextModal
        open={isAuxiliaryTextOpen}
        ticket={currentTicket}
        onClose={() => setAuxiliaryTextOpen(false)}
        onCopied={() =>
          setFeedback({
            message: "La información auxiliar se copió al portapapeles.",
            tone: "success",
          })
        }
      />

      <div className={styles.sections}>
        <DetailSection title="Información general">
          <GeneralInformation
            ticket={currentTicket}
            onUpdate={handleGeneralInformationUpdate}
            canEditTicket={capabilities.canEditTicket}
            canEditSite={capabilities.canEditSite}
            canChangeSiteAddress={capabilities.canChangeSiteAddress}
          />
        </DetailSection>

        <DetailSection title="Descripción">
          <DescriptionSection
            description={currentTicket.description}
            editable={capabilities.canEditTicket}
            onSave={handleDescriptionUpdate}
          />
        </DetailSection>

        {capabilities.canViewImages && (
          <DetailSection title="Imagen del problema">
            <ProblemImages images={currentTicket.problemImages} />
          </DetailSection>
        )}

        <DetailSection title="Ubicación del sitio">
          <SiteLocation location={currentTicket.location} />
        </DetailSection>

        <DetailSection title="Primer SLA">
          <SLASection
            sla={currentTicket.sla.first}
            onCloseOnsite={() => handleCloseOnsiteSla("first")}
          />
        </DetailSection>

        <DetailSection title="Segundo SLA">
          <SLASection
            sla={currentTicket.sla.second}
            onCloseOnsite={() => handleCloseOnsiteSla("second")}
          />
        </DetailSection>

        <DetailSection title="Atención en sitio">
          <OnsiteAttention
            data={currentTicket.onsiteAttention}
            onUpdateProvider={handleProviderUpdate}
            onUnassignProvider={handleUnassignProvider}
            canAssignProvider={capabilities.canAssignProvider}
          />
        </DetailSection>

        <DetailSection title="Motivos de pausa">
          <ActivityList
            items={currentTicket.pauseReasons}
            emptyLabel="Sin motivos de pausa"
          />
        </DetailSection>

        <DetailSection title="Motivos de reasignación">
          <ActivityList
            items={currentTicket.reassignmentReasons}
            emptyLabel="Sin motivos de reasignación"
          />
        </DetailSection>

        <DetailSection title="Actividad remoto">
          <ActivityList
            items={currentTicket.remoteActivities}
            emptyLabel="Sin actividades remotas"
            showPerson
            editable={capabilities.canReportActivities}
            onEdit={
              capabilities.canReportActivities
                ? (activityId, message) =>
                    handleEditActivity("remoteActivities", activityId, message)
                : undefined
            }
            onDelete={
              capabilities.canDeleteObjects
                ? (activityId) =>
                    handleDeleteActivity("remoteActivities", activityId)
                : undefined
            }
          />
        </DetailSection>

        <DetailSection title="Actividad en sitio">
          <ActivityList
            items={currentTicket.onsiteActivities}
            emptyLabel="Sin actividades en sitio"
            showPerson
            editable={capabilities.canReportActivities}
            onEdit={
              capabilities.canReportActivities
                ? (activityId, message) =>
                    handleEditActivity("onsiteActivities", activityId, message)
                : undefined
            }
            onDelete={
              capabilities.canDeleteObjects
                ? (activityId) =>
                    handleDeleteActivity("onsiteActivities", activityId)
                : undefined
            }
          />
        </DetailSection>

        {capabilities.canViewImages && (
          <>
            <DetailSection title="Imágenes antes de reemplazos">
              <ImageGallery
                images={currentTicket.imageGroups.beforeReplacement}
                emptyLabel="Sin imágenes antes de reemplazos"
                editable={capabilities.canDeleteObjects}
                onDelete={
                  capabilities.canDeleteObjects
                    ? (imageId) =>
                        handleDeleteImage("beforeReplacement", imageId)
                    : undefined
                }
              />
            </DetailSection>

            <DetailSection title="Imágenes después de reemplazos">
              <ImageGallery
                images={currentTicket.imageGroups.afterReplacement}
                emptyLabel="Sin imágenes después de reemplazos"
                editable={capabilities.canDeleteObjects}
                onDelete={
                  capabilities.canDeleteObjects
                    ? (imageId) =>
                        handleDeleteImage("afterReplacement", imageId)
                    : undefined
                }
              />
            </DetailSection>

            <DetailSection title="Imágenes antes actual">
              <ImageGallery
                images={currentTicket.imageGroups.beforeCurrent}
                emptyLabel="Sin imágenes antes actual"
                editable={capabilities.canDeleteObjects}
                onDelete={
                  capabilities.canDeleteObjects
                    ? (imageId) => handleDeleteImage("beforeCurrent", imageId)
                    : undefined
                }
              />
            </DetailSection>

            <DetailSection title="Imágenes después actual">
              <ImageGallery
                images={currentTicket.imageGroups.afterCurrent}
                emptyLabel="Sin imágenes después actual"
                editable={capabilities.canDeleteObjects}
                onDelete={
                  capabilities.canDeleteObjects
                    ? (imageId) => handleDeleteImage("afterCurrent", imageId)
                    : undefined
                }
              />
            </DetailSection>

            <DetailSection title="Imágenes general hallazgo">
              <ImageGallery
                images={currentTicket.imageGroups.generalFinding}
                emptyLabel="Sin imágenes de hallazgo general"
                editable={capabilities.canDeleteObjects}
                onDelete={
                  capabilities.canDeleteObjects
                    ? (imageId) => handleDeleteImage("generalFinding", imageId)
                    : undefined
                }
              />
            </DetailSection>

            <DetailSection title="Imágenes acercamiento hallazgo">
              <ImageGallery
                images={currentTicket.imageGroups.closeFinding}
                emptyLabel="Sin imágenes de acercamiento de hallazgo"
                editable={capabilities.canDeleteObjects}
                onDelete={
                  capabilities.canDeleteObjects
                    ? (imageId) => handleDeleteImage("closeFinding", imageId)
                    : undefined
                }
              />
            </DetailSection>
          </>
        )}

        <DetailSection
          title="Tickets relacionados"
          collapsible
          defaultOpen={false}
        >
          <RelatedTickets tickets={currentTicket.relatedTickets} />
        </DetailSection>

        <DetailSection
          title="Equipos reemplazados"
          collapsible
          defaultOpen={false}
        >
          <ReplacedEquipmentTable
            equipment={currentTicket.replacedEquipment}
            onEdit={
              capabilities.canReportReplacements
                ? handleEditReplacedEquipment
                : undefined
            }
            onDelete={
              capabilities.canDeleteObjects
                ? handleDeleteReplacedEquipment
                : undefined
            }
          />
        </DetailSection>

        <DetailSection
          title="Equipos intervenidos"
          collapsible
          defaultOpen={false}
        >
          <IntervenedEquipmentTable
            equipment={currentTicket.intervenedEquipment}
            onDelete={
              capabilities.canDeleteObjects
                ? handleDeleteIntervenedEquipment
                : undefined
            }
          />
        </DetailSection>

        {capabilities.canViewMaterials && (
          <DetailSection title="Materiales" collapsible defaultOpen={false}>
            <MaterialsTable
              materials={currentTicket.materials}
              onReviewChange={handleMaterialReviewChange}
              canValidate={capabilities.canValidateMaterials}
            />
          </DetailSection>
        )}
      </div>
    </section>
  );
}
