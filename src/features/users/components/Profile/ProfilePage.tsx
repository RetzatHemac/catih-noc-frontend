import { KeyRound, Mail, UserRound } from "lucide-react";
import { useState } from "react";

import { can, PERMISSIONS, useAuth } from "../../../../auth";
import { Button } from "../../../../components/ui/Button/Button";
import { StatusMessage } from "../../../../components/ui/StatusMessage/StatusMessage";
import { getProfileName } from "../../utils/profileName";

import { ChangePasswordDialog } from "./ChangePasswordDialog";

import styles from "./ProfilePage.module.css";

export function ProfilePage() {
  const { user } = useAuth();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  if (!can(user, PERMISSIONS.PROFILE_VIEW)) {
    return (
      <main className={styles.page}>
        <StatusMessage tone="error">
          No tienes permiso para consultar este perfil.
        </StatusMessage>
      </main>
    );
  }

  const { firstName, lastName, initials } = getProfileName(user.name);
  const username = user.username ?? user.email.split("@")[0] ?? user.email;

  return (
    <main className={styles.page}>
      {passwordChanged && (
        <StatusMessage tone="success">
          Contraseña actualizada correctamente en el entorno de demostración.
        </StatusMessage>
      )}

      <section className={styles.card} aria-labelledby="profile-name">
        <div className={styles.identity}>
          <div className={styles.avatar} aria-hidden="true">
            {initials}
          </div>

          <div>
            <h2 id="profile-name">{user.name}</h2>
            <p>Información general de tu cuenta</p>
          </div>
        </div>

        <dl className={styles.details}>
          <ProfileItem label="Usuario" value={username} />
          <ProfileItem label="Nombre" value={firstName} />
          <ProfileItem label="Apellido" value={lastName || "Sin registrar"} />
          <ProfileItem label="Correo" value={user.email} isEmail />
        </dl>

        <div className={styles.actions}>
          <Button onClick={() => setPasswordDialogOpen(true)}>
            <KeyRound size={18} aria-hidden="true" />
            Cambiar contraseña
          </Button>
        </div>
      </section>

      <ChangePasswordDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        onSuccess={() => {
          setPasswordDialogOpen(false);
          setPasswordChanged(true);
        }}
      />
    </main>
  );
}

interface ProfileItemProps {
  label: string;
  value: string;
  isEmail?: boolean;
}

function ProfileItem({ label, value, isEmail = false }: ProfileItemProps) {
  const Icon = isEmail ? Mail : UserRound;

  return (
    <div className={styles.detailItem}>
      <dt>
        <Icon size={16} aria-hidden="true" />
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}
