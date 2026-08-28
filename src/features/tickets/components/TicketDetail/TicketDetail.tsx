import { useEffect, useState } from "react";

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

import {
  GeneralInformation,
  type GeneralInformationField,
} from "./GeneralInformation/GeneralInformation";

import { TicketDetailHeader } from "./TicketDetailHeader/TicketDetailHeader";

import styles from "./TicketDetail.module.css";

interface TicketDetailProps {
  ticket: TicketDetailType;
}

export function TicketDetail({ ticket }: TicketDetailProps) {
  const [currentTicket, setCurrentTicket] = useState<TicketDetailType>(ticket);
  const [isAuxiliaryTextOpen, setAuxiliaryTextOpen] = useState(false);
  type ImageGroupKey = keyof TicketDetailType["imageGroups"];

  useEffect(() => {
    setCurrentTicket(ticket);
  }, [ticket]);

  function handleStartTicket() {
    console.log("Iniciar ticket:", currentTicket.id);
  }

  function handleDeleteTicket() {
    console.log("Eliminar ticket:", currentTicket.id);
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

  function handleEditRemoteActivity(activityId: string, message: string) {
    setCurrentTicket((current) => ({
      ...current,

      remoteActivities: current.remoteActivities.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              message,
            }
          : activity,
      ),
    }));
  }

  function handleDeleteRemoteActivity(activityId: string) {
    setCurrentTicket((current) => ({
      ...current,

      remoteActivities: current.remoteActivities.filter(
        (activity) => activity.id !== activityId,
      ),
    }));
  }

  function handleDeleteImage(group: ImageGroupKey, imageId: string) {
    setCurrentTicket((current) => ({
      ...current,

      imageGroups: {
        ...current.imageGroups,

        [group]: current.imageGroups[group].filter(
          (image) => image.id !== imageId,
        ),
      },
    }));
  }

  function handleEditReplacedEquipment(equipment: ReplacedEquipment) {
    console.log("Editar equipo reemplazado:", equipment);

    // Después abrimos modal de edición.
  }

  function handleDeleteReplacedEquipment(equipmentId: string) {
    setCurrentTicket((current) => ({
      ...current,

      replacedEquipment: current.replacedEquipment.filter(
        (equipment) => equipment.id !== equipmentId,
      ),
    }));
  }

  function handleDeleteIntervenedEquipment(equipmentId: string) {
    setCurrentTicket((current) => ({
      ...current,

      intervenedEquipment: current.intervenedEquipment.filter(
        (equipment) => equipment.id !== equipmentId,
      ),
    }));
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
        onStartTicket={handleStartTicket}
        onDeleteTicket={handleDeleteTicket}
      />

      <CopyAuxiliaryTextModal
        open={isAuxiliaryTextOpen}
        ticket={currentTicket}
        onClose={() => setAuxiliaryTextOpen(false)}
      />

      <div className={styles.sections}>
        <DetailSection title="Información general">
          <GeneralInformation
            ticket={currentTicket}
            onUpdate={handleGeneralInformationUpdate}
          />
        </DetailSection>

        <DetailSection title="Descripción">
          <DescriptionSection description={currentTicket.description} />
        </DetailSection>

        <DetailSection title="Imagen del problema">
          <ProblemImages images={currentTicket.problemImages} />
        </DetailSection>

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

        <DetailSection title="Actividades remoto">
          <ActivityList
            items={currentTicket.remoteActivities}
            emptyLabel="Sin actividades remotas"
            showPerson
            editable
            onEdit={handleEditRemoteActivity}
            onDelete={handleDeleteRemoteActivity}
          />
        </DetailSection>

        <DetailSection title="Imágenes antes de reemplazos">
          <ImageGallery
            images={currentTicket.imageGroups.beforeReplacement}
            emptyLabel="Sin imágenes antes de reemplazos"
            editable
            onDelete={(imageId) =>
              handleDeleteImage("beforeReplacement", imageId)
            }
          />
        </DetailSection>

        <DetailSection title="Imágenes después de reemplazos">
          <ImageGallery
            images={currentTicket.imageGroups.afterReplacement}
            emptyLabel="Sin imágenes después de reemplazos"
            editable
            onDelete={(imageId) =>
              handleDeleteImage("afterReplacement", imageId)
            }
          />
        </DetailSection>

        <DetailSection title="Imágenes antes actual">
          <ImageGallery
            images={currentTicket.imageGroups.beforeCurrent}
            emptyLabel="Sin imágenes antes actual"
            editable
            onDelete={(imageId) => handleDeleteImage("beforeCurrent", imageId)}
          />
        </DetailSection>

        <DetailSection title="Imágenes después actual">
          <ImageGallery
            images={currentTicket.imageGroups.afterCurrent}
            emptyLabel="Sin imágenes después actual"
            editable
            onDelete={(imageId) => handleDeleteImage("afterCurrent", imageId)}
          />
        </DetailSection>

        <DetailSection title="Imágenes general hallazgo">
          <ImageGallery
            images={currentTicket.imageGroups.generalFinding}
            emptyLabel="Sin imágenes de hallazgo general"
            editable
            onDelete={(imageId) => handleDeleteImage("generalFinding", imageId)}
          />
        </DetailSection>

        <DetailSection title="Imágenes acercamiento hallazgo">
          <ImageGallery
            images={currentTicket.imageGroups.closeFinding}
            emptyLabel="Sin imágenes de acercamiento de hallazgo"
            editable
            onDelete={(imageId) => handleDeleteImage("closeFinding", imageId)}
          />
        </DetailSection>

        <DetailSection title="Tickets relacionados">
          <RelatedTickets tickets={currentTicket.relatedTickets} />
        </DetailSection>

        <DetailSection
          title="Equipos reemplazados"
          collapsible
          defaultOpen={false}
        >
          <ReplacedEquipmentTable
            equipment={currentTicket.replacedEquipment}
            onEdit={handleEditReplacedEquipment}
            onDelete={handleDeleteReplacedEquipment}
          />
        </DetailSection>

        <DetailSection
          title="Equipos intervenidos"
          collapsible
          defaultOpen={false}
        >
          <IntervenedEquipmentTable
            equipment={currentTicket.intervenedEquipment}
            onDelete={handleDeleteIntervenedEquipment}
          />
        </DetailSection>

        <DetailSection title="Materiales" collapsible defaultOpen={false}>
          <MaterialsTable
            materials={currentTicket.materials}
            onReviewChange={handleMaterialReviewChange}
          />
        </DetailSection>
      </div>
    </section>
  );
}
