import { useId, useMemo, useRef, useState } from "react";

import { MOCK_TICKETS } from "../../../features/tickets/config/mockTickets";
import { createTicketListToolsContext } from "../../../features/tickets/utils/ticketListTools";
import type { TicketFilters } from "../../../features/tickets/types/tickets.types";
import {
  createInitialTicketFilters,
  filterTickets,
} from "../../../features/tickets/utils/ticketFilters";
import {
  applyTicketStatusOverrides,
  type TicketStatusOverrides,
} from "../../../features/tickets/utils/ticketStatus";

import { SidebarFilters } from "./SidebarFilters/SidebarFilters";
import { SidebarFooter } from "./SidebarFooter/SidebarFooter";
import { SidebarHeader } from "./SidebarHeader/SidebarHeader";
import { SidebarMenu } from "./SidebarMenu/SidebarMenu";
import { TicketList } from "./TicketList/TicketList";
import { TicketQueues } from "./TicketQueues/TicketQueues";

import styles from "./Sidebar.module.css";

interface SidebarProps {
  ticketStatusOverrides?: TicketStatusOverrides;
}

export function Sidebar({ ticketStatusOverrides = {} }: SidebarProps) {
  const ticketListRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filters, setFilters] = useState<TicketFilters>(
    createInitialTicketFilters,
  );
  const tickets = useMemo(
    () => applyTicketStatusOverrides(MOCK_TICKETS, ticketStatusOverrides),
    [ticketStatusOverrides],
  );
  const filteredTickets = useMemo(
    () => filterTickets(tickets, filters),
    [filters, tickets],
  );
  const listToolsContext = useMemo(
    () => createTicketListToolsContext(filters, filteredTickets),
    [filters, filteredTickets],
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

  function showTicketListStart() {
    function focusList() {
      const list = ticketListRef.current;
      if (!list) return;

      list.focus({ preventScroll: true });
      list.scrollTop = 0;
    }

    if (menuOpen) {
      setMenuOpen(false);
      window.requestAnimationFrame(focusList);
    } else {
      focusList();
    }
  }

  function closeMenu() {
    setMenuOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.workspace}>
        <div
          className={`${styles.content} ${menuOpen ? styles.covered : ""}`}
          inert={menuOpen}
          aria-hidden={menuOpen || undefined}
        >
          <SidebarHeader
            searchQuery={filters.query}
            onSearchQueryChange={(query) => updateFilters({ query })}
          />

          <SidebarFilters
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilterControls}
          />

          <section className={styles.ticketArea}>
            <TicketQueues
              selectedQueue={filters.queue}
              onSelectQueue={(queue) => updateFilters({ queue })}
            />
            <TicketList
              tickets={filteredTickets}
              totalCount={tickets.length}
              scrollRef={ticketListRef}
            />
          </section>
        </div>
        <SidebarMenu
          id={menuId}
          open={menuOpen}
          onClose={closeMenu}
          onNavigate={closeMenu}
          listToolsContext={listToolsContext}
        />
      </div>

      <SidebarFooter
        onPendingClick={showTicketListStart}
        menuOpen={menuOpen}
        menuId={menuId}
        menuButtonRef={menuButtonRef}
        onToggleMenu={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
        onNavigate={() => setMenuOpen(false)}
      />
    </aside>
  );
}
