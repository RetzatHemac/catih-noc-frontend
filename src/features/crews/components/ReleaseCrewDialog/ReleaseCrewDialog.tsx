import { useState } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Select } from "../../../../components/ui/Select/Select";
import type { ReleasableCrew } from "../../types/releasableCrew.types";

import styles from "./ReleaseCrewDialog.module.css";

interface ReleaseCrewDialogProps {
  crews: ReleasableCrew[];
  onClose: () => void;
  onRelease: (crewId: string) => void;
}

export function ReleaseCrewDialog({
  crews,
  onClose,
  onRelease,
}: ReleaseCrewDialogProps) {
  const [crewId, setCrewId] = useState("");
  const selectedCrew = crews.find((crew) => crew.id === crewId);

  return (
    <Modal
      open
      title="Liberar cuadrilla"
      onClose={onClose}
      size="sm"
      footer={
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="release-crew-form"
            disabled={!selectedCrew}
          >
            Liberar
          </Button>
        </div>
      }
    >
      {crews.length > 0 ? (
        <form
          id="release-crew-form"
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            if (selectedCrew) onRelease(selectedCrew.id);
          }}
        >
          <p>
            Selecciona la cuadrilla que debe quedar disponible para una nueva
            asignación.
          </p>
          <FormField label="Cuadrilla" htmlFor="release-crew" required>
            <Select
              id="release-crew"
              value={crewId}
              options={crews.map((crew) => ({
                value: crew.id,
                label: `${crew.name} · ${crew.closedTicketIdentifier}`,
              }))}
              onChange={(event) => setCrewId(event.target.value)}
            />
          </FormField>
          {selectedCrew && (
            <dl className={styles.detail}>
              <div>
                <dt>Proveedor</dt>
                <dd>{selectedCrew.provider}</dd>
              </div>
              <div>
                <dt>Último folio cerrado</dt>
                <dd>{selectedCrew.closedTicketIdentifier}</dd>
              </div>
            </dl>
          )}
        </form>
      ) : (
        <p className={styles.empty}>No hay cuadrillas pendientes de liberar.</p>
      )}
    </Modal>
  );
}
