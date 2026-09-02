import { Inbox, Wifi } from "lucide-react";
import { Boxes } from "lucide-react";

import type { TicketQueue } from "../../../../features/tickets/types/tickets.types";

import styles from "./TicketQueues.module.css";

const queues: {
  id: TicketQueue;
  label: string;
  icon: typeof Inbox;
}[] = [
  {
    id: "general",
    label: "Bandeja general",
    icon: Inbox,
  },
  {
    id: "3k",
    label: "3K",
    icon: Boxes,
  },
  {
    id: "wifi-mundial",
    label: "WiFi Mundial",
    icon: Wifi,
  },
];

interface TicketQueuesProps {
  selectedQueue: TicketQueue;
  onSelectQueue: (queue: TicketQueue) => void;
}

export function TicketQueues({
  selectedQueue,
  onSelectQueue,
}: TicketQueuesProps) {
  return (
    <nav className={styles.queues} aria-label="Bandejas de tickets">
      {queues.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={`${styles.queue} ${
            selectedQueue === id ? styles.active : ""
          }`}
          onClick={() => onSelectQueue(id)}
          aria-current={selectedQueue === id ? "page" : undefined}
        >
          <Icon size={17} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
