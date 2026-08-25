import { Outlet } from "react-router-dom";

import {
  NavigationProvider,
  useNavigation,
} from "../../../app/providers/NavigationProvider";

import { Sidebar } from "../Sidebar/Sidebar";
import { TaskBar } from "../TaskBar/TaskBar";
import { DetailHeader } from "../Detail/DetailHeader";

import styles from "./AppShell.module.css";

export function AppShell() {
  return (
    <NavigationProvider>
      <AppShellContent />
    </NavigationProvider>
  );
}

function AppShellContent() {
  const { showDetail, showSidebar } = useNavigation();

  return (
    <div className={styles.shell}>
      <aside
        className={styles.sidebar}
        style={{ display: showSidebar ? "block" : "none" }}
      >
        <Sidebar />
      </aside>

      <aside className={styles.taskbar}>
        <TaskBar />
        <div className={styles.placeholder}>Actions</div>
      </aside>

      <main
        className={styles.detail}
        style={{ display: showDetail ? "flex" : "none" }}
      >
        <DetailHeader />

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
