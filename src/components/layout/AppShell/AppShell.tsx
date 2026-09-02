import { useState } from "react";
import { Outlet, useMatch } from "react-router-dom";

import { useAuth } from "../../../auth";
import { useNavigation } from "../../../app/hooks/useNavigation";
import { NavigationProvider } from "../../../app/providers/NavigationProvider";
import { TaskbarActionDialog } from "../../../features/tickets/components/TaskbarActions/TaskbarActionDialog";
import type { TaskbarActionId } from "../../../features/tickets/config/taskbarActions";
import { TicketWorkspaceProvider } from "../../../features/tickets/context/TicketWorkspaceProvider";
import { useTicketWorkspace } from "../../../features/tickets/context/useTicketWorkspace";
import { getMockTicketDetail } from "../../../features/tickets/mocks/ticketDetail.mock";
import { getVisibleTaskbarActions } from "../../../features/tickets/policies/taskbarAccess";

import { Sidebar } from "../Sidebar/Sidebar";
import { TaskBar } from "../TaskBar/TaskBar";
import { DetailHeader } from "../Detail/DetailHeader";

import styles from "./AppShell.module.css";

export function AppShell() {
  return (
    <NavigationProvider>
      <TicketWorkspaceBoundary />
    </NavigationProvider>
  );
}

function TicketWorkspaceBoundary() {
  const ticketMatch = useMatch("/tickets/:ticketId");
  const ticketId = ticketMatch?.params.ticketId;
  const initialTicket = ticketId ? getMockTicketDetail(ticketId) : null;

  return (
    <TicketWorkspaceProvider
      key={ticketId ?? "without-active-ticket"}
      initialTicket={initialTicket ?? null}
    >
      <AppShellContent />
    </TicketWorkspaceProvider>
  );
}

function AppShellContent() {
  const { showDetail, showSidebar } = useNavigation();
  const { user } = useAuth();
  const { ticket } = useTicketWorkspace();
  const [activeAction, setActiveAction] = useState<TaskbarActionId | null>(
    null,
  );
  const taskbarActions = ticket
    ? getVisibleTaskbarActions(user, ticket.status)
    : [];
  const showTaskbar = Boolean(ticket && taskbarActions.length > 0);

  function handleTaskbarAction(actionId: TaskbarActionId) {
    if (!ticket) {
      return;
    }

    setActiveAction(actionId);
  }

  return (
    <div className={`${styles.shell} ${showTaskbar ? styles.hasTaskbar : ""}`}>
      <aside
        className={styles.sidebar}
        style={{ display: showSidebar ? "block" : "none" }}
      >
        <Sidebar />
      </aside>

      {showTaskbar && (
        <div className={styles.taskbar}>
          <TaskBar actions={taskbarActions} onAction={handleTaskbarAction} />
        </div>
      )}

      <main
        className={styles.detail}
        style={{ display: showDetail ? "flex" : "none" }}
      >
        <DetailHeader />

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>

      <TaskbarActionDialog
        actionId={activeAction}
        onClose={() => setActiveAction(null)}
      />
    </div>
  );
}
