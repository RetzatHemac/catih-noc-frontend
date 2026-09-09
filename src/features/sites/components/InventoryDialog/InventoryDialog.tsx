import {
  Archive,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Images,
  LockKeyhole,
  RefreshCcw,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import {
  DataTable,
  type DataTableColumn,
} from "../../../../components/patterns/DataTable/DataTable";
import { ImageGallery } from "../../../../components/patterns/ImageGallery/ImageGallery";
import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { Select } from "../../../../components/ui/Select/Select";
import { StatusMessage } from "../../../../components/ui/StatusMessage/StatusMessage";
import { Textarea } from "../../../../components/ui/Textarea/Textarea";
import { MOCK_CREWS } from "../../mocks/sites.mock";
import type { SiteInventoryItem, SiteRecord } from "../../types/site.types";
import {
  downloadSiteImages,
  downloadSiteProtocol,
} from "../../utils/siteDownloads";

import styles from "./InventoryDialog.module.css";

type InventoryAction = "status" | "crew" | "inaccessible" | null;

interface InventoryDialogProps {
  site: SiteRecord;
  onChange: (site: SiteRecord) => void;
  onClose: () => void;
}

export function InventoryDialog({
  site,
  onChange,
  onClose,
}: InventoryDialogProps) {
  const [action, setAction] = useState<InventoryAction>(null);
  const [showImages, setShowImages] = useState(false);
  const [error, setError] = useState("");

  function updateInventory(patch: Partial<SiteRecord["inventory"]>) {
    onChange({
      ...site,
      inventory: { ...site.inventory, ...patch },
    });
    setAction(null);
  }

  async function downloadImages(group?: "replacement") {
    setError("");
    try {
      await downloadSiteImages(site, group);
    } catch {
      setError("No fue posible preparar las imágenes para descarga.");
    }
  }

  const columns: DataTableColumn<SiteInventoryItem>[] = [
    { key: "asset", header: "Activo fijo", render: (item) => item.fixedAsset },
    { key: "brand", header: "Marca", render: (item) => item.brand },
    { key: "model", header: "Modelo", render: (item) => item.model },
    { key: "serial", header: "Serie", render: (item) => item.serial },
    { key: "status", header: "Estatus", render: (item) => item.status },
    { key: "company", header: "Empresa", render: (item) => item.company },
    {
      key: "replacement",
      header: "Reemplazo",
      render: (item) => item.replacement,
    },
  ];

  return (
    <Modal
      open
      title={`Inventario sitio ${site.code}`}
      size="xl"
      onClose={onClose}
    >
      <div className={styles.content}>
        {error && <StatusMessage tone="error">{error}</StatusMessage>}

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => setAction("status")}>
            <RefreshCcw size={17} aria-hidden="true" /> Cambiar status
          </Button>
          <Button variant="secondary" disabled title="Función pendiente">
            <CheckCircle2 size={17} aria-hidden="true" /> Concluir reemplazos
          </Button>
          <Button
            variant="secondary"
            onClick={() => downloadSiteProtocol(site)}
          >
            <FileText size={17} aria-hidden="true" /> Descargar protocolo
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowImages((current) => !current)}
            aria-expanded={showImages}
          >
            <Images size={17} aria-hidden="true" />{" "}
            {showImages ? "Ocultar imágenes" : "Ver todas las imágenes"}
          </Button>
        </div>

        {action && (
          <InventoryActionForm
            action={action}
            site={site}
            onCancel={() => setAction(null)}
            onSave={updateInventory}
          />
        )}

        {showImages && (
          <section
            className={styles.images}
            aria-label={`Imágenes del sitio ${site.code}`}
          >
            <div className={styles.imagesHeader}>
              <h3>Sitio {site.code}</h3>
              <Button size="sm" onClick={() => void downloadImages()}>
                <Download size={16} aria-hidden="true" /> Descargar imágenes
              </Button>
            </div>
            <ImageGallery
              images={site.inventory.images}
              emptyLabel="Este sitio no tiene imágenes."
            />
          </section>
        )}

        <div className={styles.notes}>
          <section>
            <h3>Descripción</h3>
            <p>{site.inventory.description || "Sin descripción"}</p>
          </section>
          <section>
            <h3>Observaciones</h3>
            <p>{site.inventory.observations || "Sin observaciones"}</p>
          </section>
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => void downloadImages("replacement")}
          >
            <Archive size={17} aria-hidden="true" /> Descargar imágenes de
            reemplazo
          </Button>
          <Button variant="secondary" onClick={() => setAction("crew")}>
            <RefreshCcw size={17} aria-hidden="true" /> Cambiar cuadrilla
          </Button>
          <Button variant="secondary" onClick={() => setAction("inaccessible")}>
            <LockKeyhole size={17} aria-hidden="true" /> Marcar inaccesible
          </Button>
          <Button variant="secondary" disabled title="Función pendiente">
            <CheckCircle2 size={17} aria-hidden="true" /> Marcar accesible
          </Button>
        </div>

        <section className={styles.tableSection}>
          <h3>Inventario</h3>
          <DataTable
            data={site.inventory.items}
            columns={columns}
            getRowId={(item) => item.id}
            emptyLabel="No hay equipos en el inventario."
            actions={(item) => (
              <Button
                variant="ghost"
                size="sm"
                disabled
                aria-label={`Ver ${item.fixedAsset}, próximamente`}
                title="Acción pendiente"
              >
                <Eye size={16} aria-hidden="true" />
              </Button>
            )}
          />
        </section>
      </div>
    </Modal>
  );
}

function InventoryActionForm({
  action,
  site,
  onCancel,
  onSave,
}: {
  action: Exclude<InventoryAction, null>;
  site: SiteRecord;
  onCancel: () => void;
  onSave: (patch: Partial<SiteRecord["inventory"]>) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (action === "status")
      onSave({ status: String(data.get("status")) as "pending" | "completed" });
    if (action === "crew") onSave({ crewId: String(data.get("crewId")) });
    if (action === "inaccessible")
      onSave({ inaccessibleReason: String(data.get("reason") ?? "").trim() });
  }

  return (
    <form className={styles.actionForm} onSubmit={submit}>
      {action === "status" && (
        <FormField
          label="Status del inventario"
          htmlFor="inventory-status"
          required
        >
          <Select
            id="inventory-status"
            name="status"
            options={[
              { value: "pending", label: "Pendiente" },
              { value: "completed", label: "Completado" },
            ]}
            defaultValue={site.inventory.status}
            required
          />
        </FormField>
      )}
      {action === "crew" && (
        <FormField label="Cuadrilla" htmlFor="inventory-crew" required>
          <Select
            id="inventory-crew"
            name="crewId"
            options={MOCK_CREWS}
            defaultValue={site.inventory.crewId}
            required
          />
        </FormField>
      )}
      {action === "inaccessible" && (
        <FormField
          label="Motivo de inaccesibilidad"
          htmlFor="inventory-reason"
          required
        >
          <Textarea
            id="inventory-reason"
            name="reason"
            defaultValue={site.inventory.inaccessibleReason}
            rows={4}
            required
          />
        </FormField>
      )}
      <div className={styles.formActions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  );
}
