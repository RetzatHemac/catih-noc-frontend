import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { ConfirmDialog } from "../../../../components/patterns/ConfirmDialog/ConfirmDialog";
import {
  DataTable,
  type DataTableColumn,
} from "../../../../components/patterns/DataTable/DataTable";
import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Input } from "../../../../components/ui/Input/Input";
import { Modal } from "../../../../components/ui/Modal/Modal";
import type { SiteAddressing, SiteRecord } from "../../types/site.types";

import styles from "./AddressingDialog.module.css";

interface AddressingDialogProps {
  site: SiteRecord;
  onChange: (addressing: SiteAddressing[]) => void;
  onClose: () => void;
}

export function AddressingDialog({
  site,
  onChange,
  onClose,
}: AddressingDialogProps) {
  const [editing, setEditing] = useState<SiteAddressing | null | undefined>(
    undefined,
  );
  const [deleting, setDeleting] = useState<SiteAddressing>();
  const isForm = editing !== undefined;

  function returnToList() {
    setEditing(undefined);
  }

  function saveAddressing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const record: SiteAddressing = {
      id: editing?.id ?? `addressing-${Date.now()}`,
      ipAddress: value(data, "ipAddress"),
      subnetMask: value(data, "subnetMask"),
      gateway: value(data, "gateway"),
      primaryUser: value(data, "primaryUser"),
      primaryPassword: value(data, "primaryPassword"),
      secondaryUser: value(data, "secondaryUser"),
      secondaryPassword: value(data, "secondaryPassword"),
      siteEquipment: value(data, "siteEquipment"),
      comments: value(data, "comments"),
    };
    const exists = site.addressing.some((item) => item.id === record.id);
    onChange(
      exists
        ? site.addressing.map((item) => (item.id === record.id ? record : item))
        : [...site.addressing, record],
    );
    returnToList();
  }

  const columns: DataTableColumn<SiteAddressing>[] = [
    { key: "ip", header: "Dirección IP", render: (item) => item.ipAddress },
    {
      key: "mask",
      header: "Máscara de subred",
      render: (item) => item.subnetMask,
    },
    { key: "gateway", header: "Gateway", render: (item) => item.gateway },
    {
      key: "primaryUser",
      header: "Usuario principal",
      render: (item) => item.primaryUser || "—",
    },
    {
      key: "primaryPassword",
      header: "Contraseña principal",
      render: (item) => item.primaryPassword || "—",
    },
    {
      key: "secondaryUser",
      header: "Usuario secundario",
      render: (item) => item.secondaryUser || "—",
    },
    {
      key: "secondaryPassword",
      header: "Contraseña secundaria",
      render: (item) => item.secondaryPassword || "—",
    },
    {
      key: "equipment",
      header: "Sitio/Equipo",
      render: (item) => item.siteEquipment || "—",
    },
    {
      key: "comments",
      header: "Comentario",
      render: (item) => item.comments || "—",
    },
  ];

  return (
    <>
      <Modal
        open
        title={
          isForm
            ? editing
              ? "Editar direccionamiento"
              : "Nuevo direccionamiento"
            : "Direccionamiento de sitio"
        }
        size="xl"
        onClose={isForm ? returnToList : onClose}
        footer={
          isForm ? (
            <>
              <Button variant="secondary" onClick={returnToList}>
                Cancelar
              </Button>
              <Button type="submit" form="site-addressing-form">
                Guardar direccionamiento
              </Button>
            </>
          ) : undefined
        }
      >
        {isForm ? (
          <form
            id="site-addressing-form"
            className={styles.form}
            onSubmit={saveAddressing}
          >
            <AddressSection title="Direccionamiento">
              <div className={styles.fields}>
                <Field
                  name="ipAddress"
                  label="Dirección IP"
                  initial={editing?.ipAddress}
                  required
                />
                <Field
                  name="subnetMask"
                  label="Máscara"
                  initial={editing?.subnetMask}
                  required
                />
                <Field
                  name="gateway"
                  label="Gateway"
                  initial={editing?.gateway}
                  required
                />
              </div>
            </AddressSection>
            <AddressSection title="Accesos">
              <div className={styles.fields}>
                <Field
                  name="primaryUser"
                  label="Usuario principal"
                  initial={editing?.primaryUser}
                  autoComplete="off"
                />
                <Field
                  name="primaryPassword"
                  label="Contraseña principal"
                  initial={editing?.primaryPassword}
                  autoComplete="off"
                />
                <Field
                  name="secondaryUser"
                  label="Usuario secundario"
                  initial={editing?.secondaryUser}
                  autoComplete="off"
                />
                <Field
                  name="secondaryPassword"
                  label="Contraseña secundaria"
                  initial={editing?.secondaryPassword}
                  autoComplete="off"
                />
              </div>
            </AddressSection>
            <AddressSection title="Información">
              <div className={styles.fields}>
                <Field
                  name="siteEquipment"
                  label="Sitio/Equipo"
                  initial={editing?.siteEquipment}
                />
                <Field
                  name="comments"
                  label="Comentarios"
                  initial={editing?.comments}
                />
              </div>
            </AddressSection>
          </form>
        ) : (
          <div className={styles.list}>
            <div className={styles.listHeader}>
              <p>Sitio {site.code}</p>
              <Button onClick={() => setEditing(null)}>
                <Plus size={17} aria-hidden="true" /> Agregar nuevo
                direccionamiento
              </Button>
            </div>
            <DataTable
              data={site.addressing}
              columns={columns}
              getRowId={(item) => item.id}
              emptyLabel="Este sitio no tiene direccionamientos registrados."
              actions={(item) => (
                <div className={styles.actions}>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Editar direccionamiento ${item.ipAddress}`}
                    onClick={() => setEditing(item)}
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Eliminar direccionamiento ${item.ipAddress}`}
                    onClick={() => setDeleting(item)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                </div>
              )}
            />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar direccionamiento"
        description={`¿Estás seguro de eliminar el direccionamiento ${deleting?.ipAddress ?? "seleccionado"}?`}
        confirmLabel="Eliminar direccionamiento"
        danger
        onClose={() => setDeleting(undefined)}
        onConfirm={() => {
          if (!deleting) return;
          onChange(site.addressing.filter((item) => item.id !== deleting.id));
          setDeleting(undefined);
        }}
      />
    </>
  );
}

function AddressSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Field({
  name,
  label,
  initial,
  required,
  ...props
}: { name: string; label: string; initial?: string; required?: boolean } & Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "autoComplete"
>) {
  const id = `addressing-${name}`;
  return (
    <FormField label={label} htmlFor={id} required={required}>
      <Input
        {...props}
        id={id}
        name={name}
        defaultValue={initial}
        required={required}
      />
    </FormField>
  );
}

function value(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}
