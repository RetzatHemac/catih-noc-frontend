import { Outlet } from "react-router-dom";

import { Sidebar } from "../Sidebar/Sidebar";

import styles from "./AppShell.module.css";

export function AppShell() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>

      <aside className={styles.taskbar}>
        <div className={styles.placeholder}>Actions</div>
      </aside>

      <main className={styles.detail}>
        <Outlet />
      </main>
    </div>
  );
}
