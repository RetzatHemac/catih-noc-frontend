import { Building2, UserRound, UsersRound, X } from "lucide-react";

import { EditableField } from "../../../../../components/patterns/EditableField/EditableField";
import { Button } from "../../../../../components/ui/Button/Button";

import type { OnsiteAttention as OnsiteAttentionType } from "../../../types/ticketDetail.types";

import styles from "./OnSiteAttention.module.css";

interface OnsiteAttentionProps {
  data: OnsiteAttentionType;
  onUpdateProvider: (value: string) => void;
  onUnassignProvider: () => void;
}

const PROVIDER_OPTIONS = [
  {
    value: "Proveedor Demo",
    label: "Proveedor Demo",
  },
  {
    value: "Proveedor Norte",
    label: "Proveedor Norte",
  },
  {
    value: "Proveedor Occidente",
    label: "Proveedor Occidente",
  },
];

export function OnsiteAttention({
  data,
  onUpdateProvider,
  onUnassignProvider,
}: OnsiteAttentionProps) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <InfoField
          icon={<UserRound size={17} aria-hidden="true" />}
          label="Líder operativo"
          value={data.operationalLeader}
        />

        <InfoField
          icon={<UserRound size={17} aria-hidden="true" />}
          label="Supervisor"
          value={data.supervisor}
        />

        <div className={styles.providerField}>
          <div className={styles.fieldHeading}>
            <Building2 size={17} aria-hidden="true" />

            <span className={styles.label}>Empresa en sitio</span>
          </div>

          <div className={styles.providerControl}>
            <EditableField
              label=""
              value={data.provider}
              editable
              control="select"
              options={PROVIDER_OPTIONS}
              onSave={onUpdateProvider}
            />

            {data.provider && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={styles.unassignButton}
                onClick={onUnassignProvider}
                aria-label="Desasignar empresa en sitio"
                title="Desasignar empresa"
              >
                <X size={17} aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.personnelSection}>
        <div className={styles.personnelHeading}>
          <UsersRound size={18} aria-hidden="true" />

          <div>
            <span className={styles.label}>Personal en sitio</span>

            <span className={styles.personnelCount}>
              {data.onsitePersonnel?.length ?? 0} registrado(s)
            </span>
          </div>
        </div>

        {data.onsitePersonnel?.length ? (
          <div className={styles.personnelList}>
            {data.onsitePersonnel.map((person) => (
              <div key={person} className={styles.person}>
                <UserRound size={15} aria-hidden="true" />
                <span>{person}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>Sin personal en sitio</div>
        )}
      </div>
    </div>
  );
}

interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

function InfoField({ icon, label, value }: InfoFieldProps) {
  return (
    <div className={styles.infoField}>
      <div className={styles.fieldHeading}>
        {icon}

        <span className={styles.label}>{label}</span>
      </div>

      <span className={styles.value}>{value ?? "Sin información"}</span>
    </div>
  );
}
