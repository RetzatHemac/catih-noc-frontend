import { useId, useState, type FormEvent } from "react";

import { Button } from "../../../../components/ui/Button/Button";
import { FormField } from "../../../../components/ui/FormField/FormField";
import { Input } from "../../../../components/ui/Input/Input";
import { Modal } from "../../../../components/ui/Modal/Modal";
import { getPasswordStrength } from "../../utils/passwordStrength";

import styles from "./ChangePasswordDialog.module.css";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChangePasswordDialog({
  open,
  onClose,
  onSuccess,
}: ChangePasswordDialogProps) {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmationId = useId();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const strength = getPasswordStrength(newPassword);
  const passwordsMatch = confirmation === newPassword;
  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    strength.score >= 3 &&
    passwordsMatch;

  function resetAndClose() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmation("");
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    setCurrentPassword("");
    setNewPassword("");
    setConfirmation("");
    onSuccess();
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title="Cambiar contraseña"
      size="md"
      initialFocusId={currentPasswordId}
      footer={
        <>
          <Button variant="secondary" onClick={resetAndClose}>
            Cancelar
          </Button>

          <Button
            type="submit"
            form="change-password-form"
            disabled={!canSubmit}
          >
            Cambiar contraseña
          </Button>
        </>
      }
    >
      <form
        id="change-password-form"
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <p className={styles.intro}>
          Elige una contraseña segura que no uses en otros servicios.
        </p>

        <FormField
          label="Contraseña actual"
          htmlFor={currentPasswordId}
          required
        >
          <Input
            id={currentPasswordId}
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
          />
        </FormField>

        <FormField
          label="Nueva contraseña"
          htmlFor={newPasswordId}
          helperText="Usa al menos 8 caracteres, mayúsculas, minúsculas, números y símbolos."
          required
        >
          <Input
            id={newPasswordId}
            type="password"
            autoComplete="new-password"
            value={newPassword}
            aria-describedby={`${newPasswordId}-message ${newPasswordId}-strength`}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            required
          />
        </FormField>

        <div
          id={`${newPasswordId}-strength`}
          className={styles.strength}
          role="progressbar"
          aria-label="Nivel de seguridad de la contraseña"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={strength.score}
          aria-valuetext={strength.label}
        >
          <div className={styles.strengthHeader}>
            <span>Nivel de seguridad</span>
            <strong>{strength.label}</strong>
          </div>

          <div className={styles.strengthTrack} data-score={strength.score}>
            {[1, 2, 3, 4].map((level) => (
              <span
                key={level}
                className={level <= strength.score ? styles.active : undefined}
              />
            ))}
          </div>
        </div>

        <FormField
          label="Confirmar nueva contraseña"
          htmlFor={confirmationId}
          error={
            confirmation && !passwordsMatch
              ? "Las contraseñas no coinciden."
              : undefined
          }
          required
        >
          <Input
            id={confirmationId}
            type="password"
            autoComplete="new-password"
            value={confirmation}
            aria-describedby={`${confirmationId}-message`}
            aria-invalid={Boolean(confirmation && !passwordsMatch)}
            onChange={(event) => setConfirmation(event.target.value)}
            required
          />
        </FormField>
      </form>
    </Modal>
  );
}
