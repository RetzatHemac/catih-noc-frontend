import { SidebarFilters } from "./SidebarFilters/SidebarFilters";
import { SidebarFooter } from "./SidebarFooter/SidebarFooter";
import { SidebarHeader } from "./SidebarHeader/SidebarHeader";
import { TicketList } from "./TicketList/TicketList";
import { TicketQueues } from "./TicketQueues/TicketQueues";

import styles from "./Sidebar.module.css";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <SidebarHeader />

      <SidebarFilters />

      <section className={styles.ticketArea}>
        <TicketQueues />
        <TicketList />
      </section>

      <SidebarFooter />
    </aside>
  );
}
