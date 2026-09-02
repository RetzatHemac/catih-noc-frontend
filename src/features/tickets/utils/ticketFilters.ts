import type { Ticket, TicketFilters } from "../types/tickets.types";

export function createInitialTicketFilters(): TicketFilters {
  return {
    query: "",
    statuses: [],
    supervisor: "",
    user: "",
    project: "",
    type: "",
    queue: "general",
  };
}

export function countActiveTicketFilters(filters: TicketFilters): number {
  return (
    filters.statuses.length +
    Number(Boolean(filters.supervisor)) +
    Number(Boolean(filters.user)) +
    Number(Boolean(filters.project)) +
    Number(Boolean(filters.type))
  );
}

export function filterTickets(
  tickets: Ticket[],
  filters: TicketFilters,
): Ticket[] {
  const query = normalizeSearchValue(filters.query);

  return tickets.filter((ticket) => {
    const matchesQuery =
      !query ||
      [
        ticket.id,
        ticket.helixId,
        ticket.site,
        ticket.category,
        ticket.attendedBy,
      ].some((value) => normalizeSearchValue(value).includes(query));

    const matchesStatus =
      filters.statuses.length === 0 || filters.statuses.includes(ticket.status);

    const matchesQueue =
      filters.queue === "general" || ticket.queue === filters.queue;

    return (
      matchesQuery &&
      matchesStatus &&
      matchesQueue &&
      (!filters.supervisor || ticket.supervisorId === filters.supervisor) &&
      (!filters.user || ticket.assigneeId === filters.user) &&
      (!filters.project || ticket.projectId === filters.project) &&
      (!filters.type || ticket.type === filters.type)
    );
  });
}

function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX")
    .trim();
}
