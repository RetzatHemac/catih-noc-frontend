import { BellRing, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../../../auth";
import {
  DataTable,
  type DataTableColumn,
} from "../../../../components/patterns/DataTable/DataTable";
import { StatusMessage } from "../../../../components/ui/StatusMessage/StatusMessage";
import { MOCK_TICKETS } from "../../config/mockTickets";
import { usePendingNotifications } from "../../context/usePendingNotifications";
import { canViewPendingTickets } from "../../policies/pendingTicketsAccess";
import {
  getUnreadPendingTickets,
  type PendingTicketItem,
} from "../../utils/pendingTickets";

import styles from "./PendingTickets.module.css";

const columns: DataTableColumn<PendingTicketItem>[] = [
  {
    key: "ticket",
    header: "Ticket",
    render: ({ ticket }) => (
      <span className={styles.identifier}>
        <span className={styles.unreadDot} aria-hidden="true" />
        {ticket.id}
        <span className={styles.srOnly}>No leído</span>
      </span>
    ),
  },
  {
    key: "site",
    header: "Sitio",
    render: ({ ticket }) => ticket.site,
  },
  {
    key: "category",
    header: "Categoría",
    render: ({ ticket }) => ticket.category,
  },
  {
    key: "assignedTo",
    header: "Asignado a",
    render: ({ ticket }) => ticket.attendedBy,
  },
  {
    key: "notifiedAt",
    header: "Notificación",
    render: ({ notification }) => (
      <time dateTime={notification.notifiedAt}>
        {formatNotificationDate(notification.notifiedAt)}
      </time>
    ),
  },
];

export function PendingTickets() {
  const { user } = useAuth();
  const { notifications, markAsRead } = usePendingNotifications();

  if (!canViewPendingTickets(user)) {
    return (
      <section className={styles.page}>
        <StatusMessage tone="error">
          No tienes permiso para consultar tickets pendientes.
        </StatusMessage>
      </section>
    );
  }

  const pendingTickets = getUnreadPendingTickets(MOCK_TICKETS, notifications);

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <div className={styles.summary} role="status">
          <div className={styles.summaryIcon}>
            <BellRing size={18} aria-hidden="true" />
          </div>
          <div>
            <strong>{pendingTickets.length}</strong>
            <span>
              {pendingTickets.length === 1
                ? "ticket pendiente no leído"
                : "tickets pendientes no leídos"}
            </span>
          </div>
        </div>
      </div>

      <DataTable
        data={pendingTickets}
        columns={columns}
        getRowId={({ notification }) => notification.id}
        emptyLabel="No hay tickets pendientes sin leer."
        actions={({ ticket, notification }) => (
          <Link
            className={styles.openLink}
            to={`/tickets/${ticket.id}`}
            onClick={() => markAsRead(notification.id)}
          >
            Ver ticket
            <ExternalLink size={15} aria-hidden="true" />
          </Link>
        )}
      />
    </section>
  );
}

function formatNotificationDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}
