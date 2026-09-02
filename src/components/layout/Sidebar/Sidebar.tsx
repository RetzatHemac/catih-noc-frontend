import { useMemo, useState } from "react";

import { MOCK_TICKETS } from "../../../features/tickets/config/mockTickets";
import type { TicketFilters } from "../../../features/tickets/types/tickets.types";
import {
  createInitialTicketFilters,
  filterTickets,
} from "../../../features/tickets/utils/ticketFilters";

import { SidebarFilters } from "./SidebarFilters/SidebarFilters";
import { SidebarFooter } from "./SidebarFooter/SidebarFooter";
import { SidebarHeader } from "./SidebarHeader/SidebarHeader";
import { SidebarTools } from "./SidebarTools/SidebarTools";
import { TicketList } from "./TicketList/TicketList";
import { TicketQueues } from "./TicketQueues/TicketQueues";

import styles from "./Sidebar.module.css";

export function Sidebar() {
  const [filters, setFilters] = useState<TicketFilters>(
    createInitialTicketFilters,
  );
  const filteredTickets = useMemo(
    () => filterTickets(MOCK_TICKETS, filters),
    [filters],
  );

  function updateFilters(patch: Partial<TicketFilters>) {
    setFilters((current) => ({ ...current, ...patch }));
  }

  function resetFilterControls() {
    setFilters((current) => ({
      ...createInitialTicketFilters(),
      query: current.query,
      queue: current.queue,
    }));
  }

  return (
    <aside className={styles.sidebar}>
      <SidebarHeader
        searchQuery={filters.query}
        onSearchQueryChange={(query) => updateFilters({ query })}
      />

      <SidebarFilters
        filters={filters}
        onChange={updateFilters}
        onReset={resetFilterControls}
      />

      <SidebarTools />

      <section className={styles.ticketArea}>
        <TicketQueues
          selectedQueue={filters.queue}
          onSelectQueue={(queue) => updateFilters({ queue })}
        />
        <TicketList
          tickets={filteredTickets}
          totalCount={MOCK_TICKETS.length}
        />
      </section>

      <SidebarFooter />
    </aside>
  );
}
