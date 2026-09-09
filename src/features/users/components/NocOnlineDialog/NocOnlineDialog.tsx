import { Button } from "../../../../components/ui/Button/Button";
import { Modal } from "../../../../components/ui/Modal/Modal";
import type { NocOnlineUser } from "../../types/nocOnlineUser.types";

import styles from "./NocOnlineDialog.module.css";

interface NocOnlineDialogProps {
  open: boolean;
  users: NocOnlineUser[];
  onClose: () => void;
}

export function NocOnlineDialog({
  open,
  users,
  onClose,
}: NocOnlineDialogProps) {
  return (
    <Modal
      open={open}
      title="NOC Online"
      onClose={onClose}
      size="sm"
      footer={<Button onClick={onClose}>Cerrar</Button>}
    >
      <p className={styles.summary} aria-live="polite">
        {users.length}{" "}
        {users.length === 1 ? "usuario disponible" : "usuarios disponibles"}
      </p>

      {users.length > 0 ? (
        <ul className={styles.list} aria-label="Usuarios NOC activos">
          {users.map((user) => (
            <li key={user.id} className={styles.user}>
              <span className={styles.status} aria-hidden="true" />
              <div className={styles.identity}>
                <strong>{user.name}</strong>
                <span>{user.roleLabel}</span>
              </div>
              <span className={styles.srOnly}>En línea</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No hay usuarios NOC activos.</p>
      )}
    </Modal>
  );
}
