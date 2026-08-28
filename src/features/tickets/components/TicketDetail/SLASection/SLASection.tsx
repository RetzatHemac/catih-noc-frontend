import { CheckCircle2, Clock3 } from "lucide-react";

import { Button } from "../../../../../components/ui/Button/Button";

import type { SLAStatus, TicketSLA } from "../../../types/ticketDetail.types";

import styles from "./SLASection.module.css";

interface SLASectionProps {
  sla: TicketSLA;
  onCloseOnsite?: () => void;
}

export function SLASection({ sla, onCloseOnsite }: SLASectionProps) {
  return (
    <div className={styles.grid}>
      <SlaField
        label="Fecha límite para atención remota"
        value={sla.remoteDeadline}
      />

      <SlaStatusField
        label="Hora real de atención remota"
        status={sla.remoteStatus}
        completedAt={sla.remoteActual}
      />

      <SlaField
        label="Fecha límite para atención en sitio"
        value={sla.onsiteDeadline}
      />

      <SlaStatusField
        label="Hora real de atención en sitio"
        status={sla.onsiteStatus}
        completedAt={sla.onsiteActual}
        onClose={sla.onsiteStatus === "IN_PROGRESS" ? onCloseOnsite : undefined}
      />
    </div>
  );
}

interface SlaFieldProps {
  label: string;
  value?: string;
}

function SlaField({ label, value }: SlaFieldProps) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>

      <div className={styles.value}>
        <Clock3 size={15} aria-hidden="true" />

        <span>{value ?? "Sin información"}</span>
      </div>
    </div>
  );
}

interface SlaStatusFieldProps {
  label: string;
  status: SLAStatus;
  completedAt?: string;
  onClose?: () => void;
}

function SlaStatusField({
  label,
  status,
  completedAt,
  onClose,
}: SlaStatusFieldProps) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>

      <div className={styles.statusRow}>
        <div className={styles.status} data-status={status}>
          <span className={styles.statusDot} />

          {status === "PENDING" && <span>Pendiente</span>}

          {status === "IN_PROGRESS" && <span>En progreso</span>}

          {status === "COMPLETED" && (
            <div className={styles.completed}>
              <span>Completado</span>

              {completedAt && (
                <span className={styles.date}>{completedAt}</span>
              )}
            </div>
          )}
        </div>

        {status === "IN_PROGRESS" && onClose && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Cerrar SLA"
            title="Cerrar SLA"
          >
            <CheckCircle2 size={18} aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
